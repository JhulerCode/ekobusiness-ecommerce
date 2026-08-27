import type { APIContext } from 'astro'
import type { ApiResult, Product } from '@/types/api'
import {
    CHECKOUT_POLICY_VERSION,
    evaluateCheckoutPromotions,
} from '@/lib/checkout-promotions'
import { failure } from './bff'
import { backendRequest, resolveSession } from './backend'

type CheckoutDraft = Record<string, any>

interface CheckoutContext {
    isClubMember: boolean
    ubigeo?: Record<string, any> | null
}

type QuoteItem = Product & {
    cantidad: number
    pu: number
    blend_datos?: unknown
    unidad?: string
    igv_afectacion?: string
}

function normalizeText(value: unknown) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase()
}

function productPrice(product: Product) {
    const ecommerceData = product.ecommerce_data || {}
    return Number(ecommerceData.precio ?? ecommerceData.price ?? product.list_price)
}

export function buildAuthoritativeCheckout(
    draft: CheckoutDraft,
    products: Product[],
    context: CheckoutContext,
) {
    if (!['envio', 'retiro'].includes(String(draft.entrega_tipo))) {
        throw new Error('INVALID_DELIVERY_TYPE')
    }
    const sourceItems = Array.isArray(draft.socio_pedido_items)
        ? draft.socio_pedido_items
        : []
    if (!sourceItems.length || sourceItems.length > 50) {
        throw new Error('INVALID_CART')
    }

    const productsById = new Map(products.map((product) => [String(product.id), product]))
    const quoteItems: QuoteItem[] = sourceItems.map((source) => {
        const product = productsById.get(String(source.articulo || ''))
        const cantidad = Number(source.cantidad)
        const pu = product ? productPrice(product) : Number.NaN
        if (
            !product || !Number.isFinite(cantidad) || cantidad <= 0 || cantidad > 100 ||
            !Number.isFinite(pu) || pu < 0
        ) {
            throw new Error('INVALID_CART')
        }
        return {
            ...product,
            cantidad,
            pu,
            blend_datos: source.blend_datos,
        } as QuoteItem
    })

    if (
        draft.entrega_tipo === 'envio' &&
        normalizeText(context.ubigeo?.provincia) !== 'LIMA'
    ) {
        throw new Error('DELIVERY_OUTSIDE_LIMA')
    }

    const quote = evaluateCheckoutPromotions(quoteItems, {
        isClubMember: context.isClubMember,
        deliveryType: draft.entrega_tipo,
    })
    const authoritativeItems = quoteItems.map((item) => ({
        articulo: item.id,
        nombre: item.ecommerce_data?.name || item.nombre,
        unidad: item.unidad,
        cantidad: item.cantidad,
        pu: item.pu,
        igv_afectacion: item.igv_afectacion,
        igv_porcentaje: 18,
        blend_datos: item.blend_datos,
    }))

    return {
        ...draft,
        monto: quote.total,
        entrega_costo: quote.deliveryCost,
        entrega_direccion_datos: draft.entrega_tipo === 'envio'
            ? {
                ...(draft.entrega_direccion_datos || {}),
                ubigeo1: context.ubigeo,
            }
            : draft.entrega_direccion_datos,
        promociones: quote.appliedPromotions.map((promotion) => ({
            ...promotion,
            policy: 'sunka-checkout',
            version: CHECKOUT_POLICY_VERSION,
        })),
        socio_pedido_items: authoritativeItems,
    }
}

export async function prepareCheckoutOrder(
    context: APIContext,
    draft: CheckoutDraft,
): Promise<ApiResult<CheckoutDraft>> {
    const sourceItems = Array.isArray(draft.socio_pedido_items)
        ? draft.socio_pedido_items
        : []
    const ids = [...new Set(sourceItems.map((item) => String(item.articulo || '')).filter(Boolean))]
    if (!ids.length || ids.length > 50) {
        return failure(422, 'invalid-cart', 'Carrito no válido', 'El carrito no contiene productos válidos.')
    }

    const productPath = `catalog/products?ids=${encodeURIComponent(ids.join(','))}`
    const ubigeoPath = draft.entrega_tipo === 'envio' && draft.entrega_ubigeo
        ? `locations/ubigeos?id=${encodeURIComponent(String(draft.entrega_ubigeo))}`
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
        if (error instanceof Error && error.message === 'DELIVERY_OUTSIDE_LIMA') {
            return failure(
                422,
                'delivery-outside-lima',
                'Dirección no disponible',
                'Los envíos solo están disponibles para distritos de Lima Metropolitana.',
            )
        }
        return failure(422, 'invalid-cart', 'Carrito no válido', 'No se pudo validar el carrito con los precios actuales.')
    }
}
