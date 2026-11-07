import type { APIContext, APIRoute } from 'astro'
import { idSchema } from '@/lib/api-schemas'
import {
    clearCheckoutCookie, getCheckoutCookie, requestWithOptionalSession, setOrderCookie,
} from '@/lib/server/backend'
import { assertSameOrigin } from '@/lib/server/bff'

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

function redirect(context: APIContext, path: string) {
    return context.redirect(path, 303)
}

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return redirect(context, '/checkout/respuesta?status=error')

    const id = idSchema.safeParse(new URL(context.request.url).searchParams.get('id'))
    if (!id.success) return redirect(context, '/checkout/respuesta?status=error')

    const transactionToken = await readTransactionToken(context.request)
    const checkoutToken = getCheckoutCookie(context, id.data)
    if (!transactionToken || !checkoutToken) {
        return redirect(context, '/checkout/respuesta?status=error')
    }

    const result = await requestWithOptionalSession<{
        status?: 'completed' | 'payment_failed' | 'manual_review' | 'processing'
        checkout_intent_id?: string
        id?: string
        order_id?: string
        order_code?: string
        access_token?: string
    }>(context, 'payments/niubiz/authorize', {
        method: 'POST',
        body: JSON.stringify({
            checkout_intent_id: id.data,
            transactionToken,
            origin: new URL(context.request.url).origin,
        }),
        checkoutToken,
    })

    if (!result.ok) {
        console.error(`[niubiz/confirm] authorize -> ${result.status} ${result.problem.type}`)
        return redirect(context, '/checkout/respuesta?status=error')
    }

    const data = result.data
    const orderId = data?.order_id || data?.id
    if (data?.status === 'completed' && orderId && data?.access_token) {
        setOrderCookie(context, orderId, data.access_token, 60 * 60)
        clearCheckoutCookie(context, id.data, 'niubiz')
        return redirect(context, `/pedidos/${encodeURIComponent(orderId)}`)
    }

    if (['payment_failed', 'manual_review'].includes(data?.status || '')) {
        clearCheckoutCookie(context, id.data, 'niubiz')
    }
    return redirect(context, `/checkout/respuesta?status=${encodeURIComponent(data?.status || 'processing')}`)
}
