import type { APIRoute } from 'astro'
import { createPaymentSchema } from '@/lib/api-schemas'
import { requestWithOptionalSession, setCheckoutCookie, setOrderCookie } from '@/lib/server/backend'
import {
    assertSameOrigin, failure, forbiddenOrigin, invalidRequest, json, parseJson,
} from '@/lib/server/bff'
import { prepareCheckoutOrder } from '@/lib/server/checkout-order'

type CheckoutOrder = {
    checkout_intent_id?: string
    checkout_access_token?: string
    order_id?: string
    order_code?: string
    order_access_token?: string
    lookup_code?: string
    amount?: number
    currency?: string
    expires_at?: string
}

type NiubizSession = {
    provider?: 'niubiz'
    sessionToken?: string
    merchantId?: string
    checkoutScriptUrl?: string
    purchaseNumber?: string
    checkout_intent_id?: string
    amount?: number
    currency?: string
    expires_at?: string
}

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, createPaymentSchema)
    if (!parsed.success) return invalidRequest()
    const prepared = prepareCheckoutOrder(context, parsed.data.partner_order)
    if (!prepared.ok) {
        console.error(`[niubiz/create-payment] prepareCheckoutOrder -> ${prepared.status} ${prepared.problem.type}`)
        return json(prepared)
    }
    const order = await requestWithOptionalSession<CheckoutOrder>(
        context,
        'payments/checkout/orders',
        {
            method: 'POST',
            body: JSON.stringify({ provider: 'niubiz', partner_order: prepared.data }),
        },
    )
    if (!order.ok) {
        console.error(`[niubiz/create-payment] checkout/orders -> ${order.status} ${order.problem.type}`)
        return json(order)
    }
    const checkout = order.data
    if (
        !checkout?.checkout_intent_id || !checkout.checkout_access_token ||
        !checkout.order_id || !checkout.order_code || !checkout.order_access_token ||
        !checkout.lookup_code
    ) {
        console.error('[niubiz/create-payment] checkout/orders sin campos requeridos')
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }

    const session = await requestWithOptionalSession<NiubizSession>(
        context,
        'payments/niubiz/session',
        {
            method: 'POST',
            body: JSON.stringify({
                checkout_intent_id: checkout.checkout_intent_id,
                email: parsed.data.email,
            }),
            checkoutToken: checkout.checkout_access_token,
        },
    )
    if (!session.ok) {
        console.error(`[niubiz/create-payment] session -> ${session.status} ${session.problem.type}`)
        return json(session)
    }
    const data = session.data
    if (
        data?.provider !== 'niubiz' || !data.sessionToken || !data.merchantId ||
        !data.checkoutScriptUrl || !data.purchaseNumber
    ) {
        console.error('[niubiz/create-payment] session sin campos requeridos')
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }

    setCheckoutCookie(context, checkout.checkout_intent_id, checkout.checkout_access_token, 'niubiz')
    setOrderCookie(context, checkout.order_id, checkout.order_access_token)
    return json({
        ok: true,
        status: 201,
        data: {
            provider: data.provider,
            sessionToken: data.sessionToken,
            merchantId: data.merchantId,
            checkoutScriptUrl: data.checkoutScriptUrl,
            purchaseNumber: data.purchaseNumber,
            checkout_intent_id: checkout.checkout_intent_id,
            order_code: checkout.order_code,
            order_id: checkout.order_id,
            lookup_code: checkout.lookup_code,
            amount: data.amount ?? checkout.amount,
            currency: data.currency ?? checkout.currency,
            expires_at: data.expires_at ?? checkout.expires_at,
            redirect_url: `/pedidos/${checkout.order_id}`,
        },
    })
}
