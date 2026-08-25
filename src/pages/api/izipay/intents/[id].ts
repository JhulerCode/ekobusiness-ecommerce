import type { APIRoute } from 'astro'
import { idSchema } from '@/lib/api-schemas'
import {
    clearCheckoutCookie, getCheckoutCookie, requestWithOptionalSession, setOrderCookie,
} from '@/lib/server/backend'
import { failure, json } from '@/lib/server/bff'

export const GET: APIRoute = async (context) => {
    const parsed = idSchema.safeParse(context.params.id)
    if (!parsed.success) return json(failure(400, 'invalid-request', 'Solicitud no válida', 'El intento de pago no es válido.'))
    const checkoutToken = getCheckoutCookie(context, parsed.data)
    if (!checkoutToken) return json(failure(401, 'checkout-access-invalid', 'Acceso al pago inválido', 'El acceso al intento de pago no es válido o ha vencido.'))
    const result = await requestWithOptionalSession<{
        status?: 'processing' | 'payment_failed' | 'manual_review' | 'completed'
        checkout_intent_id?: string
        id?: string
        codigo?: string
        access_token?: string
    }>(context, `payments/izipay/intents/${encodeURIComponent(parsed.data)}/status`, {
        checkoutToken,
    })
    if (!result.ok) return json(result)
    const data = result.data
    if (data?.status !== 'completed') return json(result)
    if (!data.id || !data.access_token) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }
    setOrderCookie(context, data.id, data.access_token)
    clearCheckoutCookie(context, parsed.data)
    const { access_token: _accessToken, ...publicData } = data
    return json({ ...result, data: { ...publicData, redirect_url: `/pedidos/${data.id}` } })
}
