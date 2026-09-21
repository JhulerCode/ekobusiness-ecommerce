import type { APIRoute } from 'astro'
import { createPaymentSchema } from '@/lib/api-schemas'
import { requestWithOptionalSession, setCheckoutCookie, setOrderCookie } from '@/lib/server/backend'
import { assertSameOrigin, failure, forbiddenOrigin, invalidRequest, json, parseJson } from '@/lib/server/bff'
import { prepareCheckoutOrder } from '@/lib/server/checkout-quote'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, createPaymentSchema)
    if (!parsed.success) return invalidRequest()
    const prepared = await prepareCheckoutOrder(context, parsed.data.socio_pedido)
    if (!prepared.ok) {
        console.error(`[create-payment] prepareCheckoutOrder -> ${prepared.status} ${prepared.problem.type}`)
        return json(prepared)
    }
    const result = await requestWithOptionalSession<{
        formToken?: string
        checkout_intent_id?: string
        checkout_access_token?: string
        orderId?: string
        order_id?: string
        order_access_token?: string
        lookup_code?: string
        amount?: number
        currency?: string
        expires_at?: string
    }>(context, 'payments/izipay/form-token', {
        method: 'POST',
        body: JSON.stringify({ ...parsed.data, socio_pedido: prepared.data }),
    })
    if (!result.ok) {
        console.error(`[create-payment] form-token -> ${result.status} ${result.problem.type}`)
        return json(result)
    }
    const data = result.data
    if (
        !data?.formToken || !data.checkout_intent_id || !data.checkout_access_token ||
        !data.orderId || !data.order_id || !data.order_access_token || !data.lookup_code
    ) {
        console.error('[create-payment] form-token sin campos requeridos')
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }
    setCheckoutCookie(context, data.checkout_intent_id, data.checkout_access_token)
    setOrderCookie(context, data.order_id, data.order_access_token)
    const {
        checkout_access_token: _checkoutAccessToken,
        order_access_token: _orderAccessToken,
        ...publicData
    } = data
    return json({
        ...result,
        data: { ...publicData, redirect_url: `/pedidos/${data.order_id}` },
    })
}
