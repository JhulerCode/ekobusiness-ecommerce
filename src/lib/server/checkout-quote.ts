import type { APIContext } from 'astro'
import type { ApiResult, Product } from '@/types/api'
import {
    CHECKOUT_POLICY_VERSION,
    evaluateCheckoutPromotions,
} from '@/lib/checkout-promotions'
import { failure } from './bff'
import { backendRequest, resolveSession } from './backend'
import { isDeliveryDateAllowed } from '@/lib/delivery-date'
import { DELIVERY_TIME_RANGE, getPickupLocation } from '@/data/pickup-locations'

type CheckoutDraft = Record<string, any>

interface CheckoutContext {
    isClubMember: boolean
    ubigeo?: Record<string, any> | null
    now?: Date
}

type QuoteItem = Product & {
    quantity: number
    unit_price: number
    blend_data?: unknown
    unit?: string
    igv_affectation?: string
}

function normalizeText(value: unknown) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase()
}

function productPrice(product: Record<string, any>) {
    const ecommerceData = product.ecommerce_data || {}
    return Number(ecommerceData.price ?? product.list_price)
}

export function buildAuthoritativeCheckout(
    draft: CheckoutDraft,
    products: Array<Record<string, any>>,
    context: CheckoutContext,
) {
    if (!['envio', 'retiro'].includes(String(draft.delivery_type))) {
        throw new Error('INVALID_DELIVERY_TYPE')
    }
    if (!isDeliveryDateAllowed(draft.delivery_date, context.now)) {
        throw new Error('INVALID_DELIVERY_DATE')
    }
    const sourceItems = Array.isArray(draft.partner_order_lines)
        ? draft.partner_order_lines
        : []
    if (!sourceItems.length || sourceItems.length > 50) {
        throw new Error('INVALID_CART')
    }

    const productsById = new Map(products.map((product) => [String(product.id), product]))
    const quoteItems: QuoteItem[] = sourceItems.map((source) => {
        const product = productsById.get(String(source.article_id || ''))
        const quantity = Number(source.quantity)
        const unit_price = product ? productPrice(product) : Number.NaN
        if (
            !product || !Number.isFinite(quantity) || quantity <= 0 || quantity > 100 ||
            !Number.isFinite(unit_price) || unit_price < 0
        ) {
            throw new Error('INVALID_CART')
        }
        return {
            ...product,
            quantity,
            unit_price,
            blend_data: source.blend_data,
        } as QuoteItem
    })

    if (
        draft.delivery_type === 'envio' &&
        normalizeText(context.ubigeo?.province || context.ubigeo?.provincia) !== 'LIMA'
    ) {
        throw new Error('DELIVERY_OUTSIDE_LIMA')
    }
    const pickupLocation = draft.delivery_type === 'retiro'
        ? getPickupLocation(draft.punto_retiro)
        : null
    if (draft.delivery_type === 'retiro' && !pickupLocation) {
        throw new Error('INVALID_PICKUP_LOCATION')
    }

    const quote = evaluateCheckoutPromotions(quoteItems, {
        isClubMember: context.isClubMember,
        deliveryType: draft.delivery_type,
    })
    const authoritativeItems = quoteItems.map((item) => ({
        article_id: item.id,
        name: item.ecommerce_data?.name || item.name,
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
        amount: quote.total,
        delivery_cost: quote.deliveryCost,
        delivery_address: draft.delivery_type === 'retiro'
            ? pickupLocation?.direccion
            : draft.delivery_address,
        delivery_address_data: draft.delivery_type === 'envio'
            ? {
                ...deliveryAddressData,
                ubigeo1: context.ubigeo,
                horario: DELIVERY_TIME_RANGE,
            }
            : {
                punto_retiro: {
                    id: pickupLocation?.id,
                    nombre: pickupLocation?.nombre,
                    direccion: pickupLocation?.direccion,
                },
                horario: DELIVERY_TIME_RANGE,
            },
        promotions: quote.appliedPromotions.map((promotion) => ({
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

    const productPath = `productos?ids=${encodeURIComponent(ids.join(','))}`
    const ubigeoPath = draft.delivery_type === 'envio' && draft.delivery_ubigeo_id
        ? `locations/ubigeos?id=${encodeURIComponent(String(draft.delivery_ubigeo_id))}`
        : null
    const [productsResult, ubigeoResult, session] = await Promise.all([
        backendRequest<Product[]>(productPath),
        ubigeoPath ? backendRequest<Record<string, any>[]>(ubigeoPath) : Promise.resolve(null),
        resolveSession(context),
    ])

    if (!productsResult.ok) {
        return { ok: false, status: productsResult.status, problem: productsResult.problem }
    }
    if (ubigeoResult && !ubigeoResult.ok) {
        return { ok: false, status: ubigeoResult.status, problem: ubigeoResult.problem }
    }
    if (session.status === 'error') {
        return failure(503, 'session-unavailable', 'Servicio no disponible', 'No se pudo validar la sesión del cliente.')
    }

    try {
        return {
            ok: true,
            status: 200,
            data: buildAuthoritativeCheckout(
                draft,
                productsResult.data || [],
                {
                    isClubMember: session.status === 'authenticated',
                    ubigeo: ubigeoResult?.data?.[0] || null,
                },
            ),
        }
    } catch (error) {
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
