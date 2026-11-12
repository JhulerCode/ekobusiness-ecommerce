import type { APIRoute } from 'astro'
import { createPaymentSchema } from '@/lib/api-schemas'
import { requestWithOptionalSession, setCheckoutCookie, setOrderCookie } from '@/lib/server/backend'
import {
    assertSameOrigin, failure, forbiddenOrigin, invalidRequest, json, parseJson,
} from '@/lib/server/bff'
import { prepareCheckoutOrder } from '@/lib/server/checkout-quote'

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

type IzipayFormToken = {
    formToken?: string
    checkout_intent_id?: string
    amount?: number
    currency?: string
    expires_at?: string
}

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, createPaymentSchema)
    if (!parsed.success) return invalidRequest()
    const prepared = await prepareCheckoutOrder(context, parsed.data.partner_order)
    if (!prepared.ok) {
        console.error(`[create-payment] prepareCheckoutOrder -> ${prepared.status} ${prepared.problem.type}`)
        return json(prepared)
    }
    const order = await requestWithOptionalSession<CheckoutOrder>(
        context,
        'payments/checkout/orders',
        {
            method: 'POST',
            body: JSON.stringify({ provider: 'izipay', partner_order: prepared.data }),
        },
    )
    if (!order.ok) {
        console.error(`[create-payment] checkout/orders -> ${order.status} ${order.problem.type}`)
        return json(order)
    }
    const checkout = order.data
    if (
        !checkout?.checkout_intent_id || !checkout.checkout_access_token ||
        !checkout.order_id || !checkout.order_code || !checkout.order_access_token ||
        !checkout.lookup_code
    ) {
        console.error('[create-payment] checkout/orders sin campos requeridos')
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }

    const payment = await requestWithOptionalSession<IzipayFormToken>(
        context,
        'payments/izipay/form-token',
        {
            method: 'POST',
            body: JSON.stringify({
                checkout_intent_id: checkout.checkout_intent_id,
                email: parsed.data.email,
                ...(parsed.data.paymentMethodToken
                    ? { paymentMethodToken: parsed.data.paymentMethodToken }
                    : {}),
            }),
            checkoutToken: checkout.checkout_access_token,
        },
    )
    if (!payment.ok) {
        console.error(`[create-payment] form-token -> ${payment.status} ${payment.problem.type}`)
        return json(payment)
    }
    if (!payment.data?.formToken) {
        console.error('[create-payment] form-token sin formToken')
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }

    setCheckoutCookie(context, checkout.checkout_intent_id, checkout.checkout_access_token)
    setOrderCookie(context, checkout.order_id, checkout.order_access_token)
    return json({
        ok: true,
        status: 201,
        data: {
            formToken: payment.data.formToken,
            checkout_intent_id: checkout.checkout_intent_id,
            order_code: checkout.order_code,
            order_id: checkout.order_id,
            lookup_code: checkout.lookup_code,
            amount: payment.data.amount ?? checkout.amount,
            currency: payment.data.currency ?? checkout.currency,
            expires_at: payment.data.expires_at ?? checkout.expires_at,
            redirect_url: `/pedidos/${checkout.order_id}`,
        },
    })
}
