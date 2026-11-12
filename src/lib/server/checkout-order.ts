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
import { ACCESS_COOKIE, REFRESH_COOKIE } from './backend'
import { isDeliveryDateAllowed } from '@/lib/delivery-date'
import { DELIVERY_TIME_RANGE, getPickupLocation } from '@/data/pickup-locations'

type CheckoutDraft = Record<string, any>

function hasCustomerSession(context: APIContext) {
    return context.cookies.has(ACCESS_COOKIE) || context.cookies.has(REFRESH_COOKIE)
}

export function buildCheckoutDraft(
    draft: CheckoutDraft,
    { isClubMember = false, now }: { isClubMember?: boolean; now?: Date } = {},
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
    const items = sourceItems.map((item: CheckoutDraft) => ({
        article_id: String(item.article_id || ''),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        line_name: item.line_name,
        presentation: item.presentation,
        blend_data: item.blend_data,
    }))
    if (
        items.some(
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

    const pickupLocation = draft.delivery_type === 'retiro'
        ? getPickupLocation(draft.punto_retiro)
        : null
    if (draft.delivery_type === 'retiro' && !pickupLocation) {
        throw new Error('INVALID_PICKUP_LOCATION')
    }

    const promotionQuote = evaluateCheckoutPromotions(items, {
        isClubMember,
        deliveryType: draft.delivery_type,
    })

    const { punto_retiro: _untrustedPickup, ...deliveryAddressData } =
        draft.delivery_address_data || {}

    return {
        ...draft,
        type: PARTNER_ORDER_TYPE,
        origin: PARTNER_ORDER_ORIGIN,
        currency_id: ORDER_CURRENCY,
        amount: promotionQuote.total,
        delivery_cost: promotionQuote.deliveryCost,
        delivery_address: draft.delivery_type === 'retiro'
            ? pickupLocation?.direccion
            : draft.delivery_address,
        delivery_address_data: draft.delivery_type === 'envio'
            ? {
                ...deliveryAddressData,
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
        partner_order_lines: items.map((item) => ({
            article_id: item.article_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            ...(item.blend_data === undefined ? {} : { blend_data: item.blend_data }),
        })),
    }
}

export function prepareCheckoutOrder(
    context: APIContext,
    draft: CheckoutDraft,
): ApiResult<CheckoutDraft> {
    try {
        return {
            ok: true,
            status: 200,
            data: buildCheckoutDraft(draft, { isClubMember: hasCustomerSession(context) }),
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
        if (error instanceof Error && error.message === 'INVALID_PICKUP_LOCATION') {
            return failure(
                422,
                'invalid-pickup-location',
                'Punto de retiro no válido',
                'Selecciona uno de los puntos de retiro disponibles.',
            )
        }
        return failure(422, 'invalid-cart', 'Carrito no válido', 'No se pudo validar el carrito.')
    }
}
