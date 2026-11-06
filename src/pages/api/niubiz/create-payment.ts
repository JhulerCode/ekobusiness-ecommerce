import type { APIRoute } from 'astro'
import { createPaymentSchema } from '@/lib/api-schemas'
import { requestWithOptionalSession, setCheckoutCookie, setOrderCookie } from '@/lib/server/backend'
import { assertSameOrigin, failure, forbiddenOrigin, invalidRequest, json, parseJson } from '@/lib/server/bff'
import { prepareCheckoutOrder } from '@/lib/server/checkout-quote'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, createPaymentSchema)
    if (!parsed.success) return invalidRequest()
    const prepared = await prepareCheckoutOrder(context, parsed.data.partner_order)
    if (!prepared.ok) {
        console.error(`[niubiz/create-payment] prepareCheckoutOrder -> ${prepared.status} ${prepared.problem.type}`)
        return json(prepared)
    }
    const result = await requestWithOptionalSession<{
        provider?: 'niubiz'
        sessionToken?: string
        merchantId?: string
        checkoutScriptUrl?: string
        purchaseNumber?: string
        checkout_intent_id?: string
        checkout_access_token?: string
        order_code?: string
        order_id?: string
        order_access_token?: string
        lookup_code?: string
        amount?: number
        currency?: string
        expires_at?: string
    }>(context, 'payments/niubiz/session', {
        method: 'POST',
        body: JSON.stringify({
            email: parsed.data.email,
            partner_order: prepared.data,
            origin: new URL(context.request.url).origin,
        }),
    })
    if (!result.ok) {
        console.error(`[niubiz/create-payment] session -> ${result.status} ${result.problem.type}`)
        return json(result)
    }
    const data = result.data
    if (
        data?.provider !== 'niubiz' || !data.sessionToken || !data.merchantId ||
        !data.checkoutScriptUrl || !data.purchaseNumber || !data.checkout_intent_id ||
        !data.checkout_access_token || !data.order_code || !data.order_id ||
        !data.order_access_token || !data.lookup_code
    ) {
        console.error('[niubiz/create-payment] session sin campos requeridos')
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }
    setCheckoutCookie(context, data.checkout_intent_id, data.checkout_access_token, 'niubiz')
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
