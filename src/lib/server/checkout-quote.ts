import type { APIContext } from 'astro'
import type { ApiResult } from '@/types/api'
import {
    CHECKOUT_POLICY_VERSION,
    evaluateCheckoutPromotions,
} from '@/lib/checkout-promotions'
import { failure } from './bff'
import {
    ORDER_CURRENCY,
    PARTNER_ORDER_ORIGIN,
    PARTNER_ORDER_TYPE,
} from '@/lib/api-schemas'
import { requestWithOptionalSession } from './backend'
import { isDeliveryDateAllowed } from '@/lib/delivery-date'
import { DELIVERY_TIME_RANGE, getPickupLocation } from '@/data/pickup-locations'

type CheckoutDraft = Record<string, any>

type CheckoutQuoteLine = {
    article_id: string
    name: string
    unit?: string
    quantity: number
    unit_price: number
    igv_affectation?: string
    igv_rate?: number
    blend_data?: unknown
    line_name?: string | null
    presentation?: unknown
}

type CheckoutQuote = {
    quote_id: string
    expires_at?: string
    currency_id?: string
    is_club_member?: boolean
    partner_order_lines: CheckoutQuoteLine[]
    ubigeo?: Record<string, any> | null
}

function normalizeText(value: unknown) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase()
}

export function buildAuthoritativeCheckout(
    draft: CheckoutDraft,
    quote: CheckoutQuote | undefined,
    { now }: { now?: Date } = {},
) {
    if (!['envio', 'retiro'].includes(String(draft.delivery_type))) {
        throw new Error('INVALID_DELIVERY_TYPE')
    }
    if (draft.type !== undefined && draft.type !== PARTNER_ORDER_TYPE) {
        throw new Error('INVALID_ORDER_TYPE')
    }
    if (draft.origin !== undefined && draft.origin !== PARTNER_ORDER_ORIGIN) {
        throw new Error('INVALID_ORDER_ORIGIN')
    }
    if (draft.currency_id !== undefined && draft.currency_id !== ORDER_CURRENCY) {
        throw new Error('INVALID_ORDER_CURRENCY')
    }
    if (draft.payment_method !== undefined && draft.payment_method !== 'tarjeta') {
        throw new Error('INVALID_PAYMENT_METHOD')
    }
    if (draft.invoice_type !== undefined && !['03', '01', 'NV'].includes(String(draft.invoice_type))) {
        throw new Error('INVALID_INVOICE_TYPE')
    }
    if (!isDeliveryDateAllowed(draft.delivery_date, now)) {
        throw new Error('INVALID_DELIVERY_DATE')
    }

    const sourceItems = Array.isArray(draft.partner_order_lines)
        ? draft.partner_order_lines
        : []
    if (!sourceItems.length || sourceItems.length > 50) {
        throw new Error('INVALID_CART')
    }

    if (!quote?.quote_id) throw new Error('INVALID_CART')
    const quoteLines = Array.isArray(quote.partner_order_lines)
        ? quote.partner_order_lines
        : []
    if (!quoteLines.length || quoteLines.length > 50) {
        throw new Error('INVALID_CART')
    }
    const quoteItems = quoteLines.map((line) => ({
        ...line,
        quantity: Number(line.quantity),
        unit_price: Number(line.unit_price),
    }))
    if (
        quoteItems.some(
            (item) =>
                !item.article_id ||
                !Number.isFinite(item.quantity) ||
                item.quantity <= 0 ||
                !Number.isFinite(item.unit_price) ||
                item.unit_price < 0,
        )
    ) {
        throw new Error('INVALID_CART')
    }

    if (
        draft.delivery_type === 'envio' &&
        normalizeText(quote.ubigeo?.province || quote.ubigeo?.provincia) !== 'LIMA'
    ) {
        throw new Error('DELIVERY_OUTSIDE_LIMA')
    }
    const pickupLocation = draft.delivery_type === 'retiro'
        ? getPickupLocation(draft.punto_retiro)
        : null
    if (draft.delivery_type === 'retiro' && !pickupLocation) {
        throw new Error('INVALID_PICKUP_LOCATION')
    }

    const promotionQuote = evaluateCheckoutPromotions(quoteItems, {
        isClubMember: quote.is_club_member === true,
        deliveryType: draft.delivery_type,
    })
    const authoritativeItems = quoteItems.map((item) => ({
        article_id: item.article_id,
        name: item.name,
        unit: item.unit,
        quantity: item.quantity,
        unit_price: item.unit_price,
        igv_affectation: item.igv_affectation,
        igv_rate: 18,
        blend_data: item.blend_data,
    }))

    const { punto_retiro: _untrustedPickup, ...deliveryAddressData } =
        draft.delivery_address_data || {}

    return {
        ...draft,
        type: PARTNER_ORDER_TYPE,
        origin: PARTNER_ORDER_ORIGIN,
        currency_id: ORDER_CURRENCY,
        quote_id: quote.quote_id,
        amount: promotionQuote.total,
        delivery_cost: promotionQuote.deliveryCost,
        delivery_address: draft.delivery_type === 'retiro'
            ? pickupLocation?.direccion
            : draft.delivery_address,
        delivery_address_data: draft.delivery_type === 'envio'
            ? {
                ...deliveryAddressData,
                ubigeo1: quote.ubigeo,
                horario: DELIVERY_TIME_RANGE,
            }
            : {
                punto_retiro: {
                    id: pickupLocation?.id,
                    name: pickupLocation?.name,
                    direccion: pickupLocation?.direccion,
                },
                horario: DELIVERY_TIME_RANGE,
            },
        promotions: promotionQuote.appliedPromotions.map((promotion) => ({
            ...promotion,
            policy: 'sunka-checkout',
            version: CHECKOUT_POLICY_VERSION,
        })),
        partner_order_lines: authoritativeItems,
    }
}

export async function prepareCheckoutOrder(
    context: APIContext,
    draft: CheckoutDraft,
): Promise<ApiResult<CheckoutDraft>> {
    const sourceItems = Array.isArray(draft.partner_order_lines)
        ? draft.partner_order_lines
        : []
    const ids = [...new Set(sourceItems.map((item) => String(item.article_id || '')).filter(Boolean))]
    if (!ids.length || ids.length > 50) {
        return failure(422, 'invalid-cart', 'Carrito no válido', 'El carrito no contiene productos válidos.')
    }

    const quoteResult = await requestWithOptionalSession<CheckoutQuote>(context, 'payments/quote', {
        method: 'POST',
        body: JSON.stringify({
            partner_order_lines: sourceItems.map((item) => {
                const unitPrice = Number(item.unit_price)
                return {
                    article_id: item.article_id,
                    quantity: item.quantity,
                    ...(Number.isFinite(unitPrice) && item.unit_price !== null
                        ? { unit_price: unitPrice }
                        : {}),
                    ...(item.blend_data === undefined ? {} : { blend_data: item.blend_data }),
                }
            }),
            delivery_type: draft.delivery_type,
            ...(draft.delivery_type === 'envio' && draft.delivery_ubigeo_id
                ? { delivery_ubigeo_id: draft.delivery_ubigeo_id }
                : {}),
        }),
    })
    if (!quoteResult.ok) {
        return { ok: false, status: quoteResult.status, problem: quoteResult.problem }
    }

    try {
        return {
            ok: true,
            status: 200,
            data: buildAuthoritativeCheckout(draft, quoteResult.data),
        }
    } catch (error) {
        if (
            error instanceof Error &&
            [
                'INVALID_ORDER_TYPE',
                'INVALID_ORDER_ORIGIN',
                'INVALID_ORDER_CURRENCY',
                'INVALID_PAYMENT_METHOD',
                'INVALID_INVOICE_TYPE',
            ].includes(error.message)
        ) {
            return failure(422, 'invalid-cart', 'Carrito no válido', 'El tipo de pedido no es válido.')
        }
        if (error instanceof Error && error.message === 'INVALID_DELIVERY_DATE') {
            return failure(
                422,
                'invalid-delivery-date',
                'Fecha no disponible',
                'La fecha elegida ya no está disponible. Selecciona una nueva fecha de entrega o recojo.',
            )
        }
        if (error instanceof Error && error.message === 'DELIVERY_OUTSIDE_LIMA') {
            return failure(
                422,
                'delivery-outside-lima',
                'Dirección no disponible',
                'Los envíos solo están disponibles para distritos de Lima Metropolitana.',
            )
        }
        if (error instanceof Error && error.message === 'INVALID_PICKUP_LOCATION') {
            return failure(
                422,
                'invalid-pickup-location',
                'Punto de retiro no válido',
                'Selecciona uno de los puntos de retiro disponibles.',
            )
        }
        return failure(422, 'invalid-cart', 'Carrito no válido', 'No se pudo validar el carrito con los precios actuales.')
    }
}
