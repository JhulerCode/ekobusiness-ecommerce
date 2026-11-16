import type { APIRoute } from 'astro'
import { orderResendSchema } from '@/lib/api-schemas'
import { backendRequest, getClientIp } from '@/lib/server/backend'
import { failure, invalidRequest, json, parseJson } from '@/lib/server/bff'
import { renderOrderLookupCode } from '@/lib/mail/order'
import { sendMail } from '@/lib/server/mail'

type ResendData = {
    message?: string
    order_id?: string
    order_code?: string
    name?: string
    lookup_code?: string
    expires_at?: string
}

export const POST: APIRoute = async (context) => {
    const parsed = await parseJson(context.request, orderResendSchema)
    if (!parsed.success) return invalidRequest()

    const result = await backendRequest<ResendData>('orders/lookup/resend', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
        clientIp: getClientIp(context.request),
    })
    if (!result.ok) return json(result)

    const data = result.data || {}
    if (!data.lookup_code || !data.order_code || !data.expires_at) {
        return json(result)
    }

    try {
        const siteUrl = new URL(context.request.url).origin
        await sendMail({
            to: parsed.data.email,
            ...renderOrderLookupCode({
                name: data.name,
                orderCode: data.order_code,
                lookupCode: data.lookup_code,
                expiresAt: data.expires_at,
                siteUrl,
            }),
        })
        return json({ ok: true, status: 200, data: { message: 'Si los datos coinciden, recibirás un nuevo código de consulta.' } })
    } catch (error) {
        console.error('[resend] no se pudo enviar el código de consulta:', error)
        return json(failure(502, 'mail-unavailable', 'Correo no disponible', 'No se pudo enviar el código de consulta.'))
    }
}
