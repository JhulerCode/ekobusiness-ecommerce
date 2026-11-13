import type { APIContext } from 'astro'
import { idSchema } from '@/lib/api-schemas'
import { clearCheckoutCookie, getCheckoutCookie, requestWithOptionalSession } from './backend'
import { assertSameOrigin, failure, forbiddenOrigin, json } from './bff'

export async function cancelCheckoutIntent(context: APIContext, provider: 'izipay' | 'niubiz') {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()

    const parsed = idSchema.safeParse(context.params.id)
    if (!parsed.success) {
        return json(
            failure(
                400,
                'invalid-request',
                'Solicitud no válida',
                'El intento de pago no es válido.',
            ),
        )
    }

    const checkoutToken = getCheckoutCookie(context, parsed.data)
    if (!checkoutToken) {
        return json(
            failure(
                401,
                'checkout-access-invalid',
                'Acceso al pago inválido',
                'El acceso al intento de pago no es válido o ha vencido.',
            ),
        )
    }

    const result = await requestWithOptionalSession<{
        status?: 'cancelled'
        checkout_intent_id?: string
    }>(context, `payments/checkout/intents/${encodeURIComponent(parsed.data)}`, {
        method: 'DELETE',
        checkoutToken,
    })
    if (!result.ok) return json(result)

    clearCheckoutCookie(context, parsed.data, provider)
    return json(result)
}
