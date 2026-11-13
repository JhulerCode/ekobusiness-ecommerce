import type { APIRoute } from 'astro'
import { idSchema } from '@/lib/api-schemas'
import {
    clearCheckoutCookie, getCheckoutCookie, requestWithOptionalSession, setOrderCookie,
} from '@/lib/server/backend'
import { assertSameOrigin, failure, forbiddenOrigin, json } from '@/lib/server/bff'

async function readTransactionToken(request: Request) {
    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
        const body = await request.json().catch(() => null) as Record<string, unknown> | null
        return String(body?.transactionToken || body?.tokenId || body?.transaction_token || '')
    }
    const form = await request.formData().catch(() => null)
    return String(
        form?.get('transactionToken') || form?.get('tokenId') || form?.get('transaction_token') || '',
    )
}

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()

    const id = idSchema.safeParse(new URL(context.request.url).searchParams.get('id'))
    if (!id.success) {
        return json(failure(
            400, 'invalid-request', 'Solicitud no válida', 'El intento de pago no es válido.',
        ))
    }

    const transactionToken = await readTransactionToken(context.request)
    const checkoutToken = getCheckoutCookie(context, id.data)
    if (!transactionToken || !checkoutToken) {
        return json(failure(
            401,
            'checkout-access-invalid',
            'Acceso al pago inválido',
            'El acceso al intento de pago no es válido o ha vencido.',
        ))
    }

    const result = await requestWithOptionalSession<{
        status?: 'completed' | 'payment_failed' | 'manual_review' | 'processing'
        checkout_intent_id?: string
        id?: string
        order_id?: string
        order_code?: string
        access_token?: string
        action_description?: string
        transaction_date?: string
    }>(context, 'payments/niubiz/authorize', {
        method: 'POST',
        body: JSON.stringify({
            checkout_intent_id: id.data,
            transactionToken,
        }),
        checkoutToken,
    })

    if (!result.ok) return json(result)

    const data = result.data
    const orderId = data?.order_id || data?.id
    const { access_token: accessToken, ...publicData } = data || {}
    if (data?.status === 'completed' && orderId && accessToken) {
        setOrderCookie(context, orderId, accessToken, 60 * 60)
        clearCheckoutCookie(context, id.data, 'niubiz')
        return json({ ...result, data: { ...publicData, redirect_url: `/pedidos/${orderId}` } })
    }

    if (data?.status === 'payment_failed') {
        clearCheckoutCookie(context, id.data, 'niubiz')
    }
    return json({ ...result, data: publicData })
}
