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
        order_id?: string
        order_code?: string
        access_token?: string
        action_description?: string
        transaction_date?: string
    }>(context, `payments/niubiz/intents/${encodeURIComponent(parsed.data)}/status`, {
        checkoutToken,
    })
    if (!result.ok) return json(result)
    const data = result.data
    const orderId = data?.order_id || data?.id
    const { access_token: accessToken, ...publicData } = data || {}
    if (data?.status !== 'completed' || !orderId || !accessToken) {
        return json({ ...result, data: publicData })
    }
    setOrderCookie(context, orderId, accessToken)
    clearCheckoutCookie(context, parsed.data, 'niubiz')
    return json({ ...result, data: { ...publicData, redirect_url: `/pedidos/${orderId}` } })
}
