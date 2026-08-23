import type { APIRoute } from 'astro'
import { createPaymentSchema } from '@/lib/api-schemas'
import { requestWithOptionalSession, setCheckoutCookie } from '@/lib/server/backend'
import { assertSameOrigin, failure, forbiddenOrigin, invalidRequest, json, parseJson } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, createPaymentSchema)
    if (!parsed.success) return invalidRequest()
    const result = await requestWithOptionalSession<{
        formToken?: string
        checkout_intent_id?: string
        checkout_access_token?: string
        orderId?: string
        amount?: number
        currency?: string
        expires_at?: string
    }>(context, 'payments/izipay/form-token', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
    })
    if (!result.ok) return json(result)
    const data = result.data
    if (!data?.formToken || !data.checkout_intent_id || !data.checkout_access_token || !data.orderId) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }
    setCheckoutCookie(context, data.checkout_intent_id, data.checkout_access_token)
    const { checkout_access_token: _checkoutAccessToken, ...publicData } = data
    return json({ ...result, data: publicData })
}
