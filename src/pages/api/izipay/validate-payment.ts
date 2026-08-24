import type { APIRoute } from 'astro'
import { validatePaymentSchema } from '@/lib/api-schemas'
import { getCheckoutCookie, requestWithOptionalSession } from '@/lib/server/backend'
import { assertSameOrigin, failure, forbiddenOrigin, invalidRequest, json, parseJson } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, validatePaymentSchema)
    if (!parsed.success) return invalidRequest()
    const result = await requestWithOptionalSession<{
        status?: 'processing'
        checkout_intent_id?: string
    }>(context, 'payments/izipay/validate', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
        checkoutToken: getCheckoutCookie(context, parsed.data.checkout_intent_id),
    })
    if (!result.ok) return json(result)
    const data = result.data
    if (result.status !== 202 || data?.status !== 'processing') {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }
    return json({ ...result, data: {
        status: 'processing',
        checkout_intent_id: data.checkout_intent_id || parsed.data.checkout_intent_id,
    } })
}
