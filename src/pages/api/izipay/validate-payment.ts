import type { APIRoute } from 'astro'
import { validatePaymentSchema } from '@/lib/api-schemas'
import { clearCheckoutCookie, getCheckoutCookie, requestWithOptionalSession, setOrderCookie } from '@/lib/server/backend'
import { assertSameOrigin, failure, forbiddenOrigin, invalidRequest, json, parseJson } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, validatePaymentSchema)
    if (!parsed.success) return invalidRequest()
    const result = await requestWithOptionalSession<{
        status?: 'processing' | 'manual_review' | 'completed'
        checkout_intent_id?: string
        id?: string
        access_token?: string
        redirect_url?: string
    }>(context, 'payments/izipay/validate', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
        checkoutToken: getCheckoutCookie(context, parsed.data.checkout_intent_id),
    })
    if (!result.ok) return json(result)
    const data = result.data
    if (result.status === 202 || data?.status === 'processing' || data?.status === 'manual_review') {
        return json({ ...result, data: {
            status: data?.status || 'processing',
            checkout_intent_id: data?.checkout_intent_id || parsed.data.checkout_intent_id,
        } })
    }
    if (!data?.id || !data.access_token) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }
    setOrderCookie(context, data.id, data.access_token)
    clearCheckoutCookie(context, parsed.data.checkout_intent_id)
    const { access_token: _accessToken, ...publicData } = data
    return json({ ...result, data: { ...publicData, redirect_url: `/pedidos/${data.id}` } })
}
