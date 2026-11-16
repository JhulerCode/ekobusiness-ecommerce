import type { APIRoute } from 'astro'
import { complaintSchema } from '@/lib/api-schemas'
import { backendRequest, getClientIp } from '@/lib/server/backend'
import { emailDeliveryWarning, failure, assertSameOrigin, forbiddenOrigin, invalidRequest, json, parseJson } from '@/lib/server/bff'
import { renderBookClaimConfirmation } from '@/lib/mail/forms'
import { sendMail } from '@/lib/server/mail'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, complaintSchema)
    if (!parsed.success) return invalidRequest()

    const result = await backendRequest<{ id: string; code: string }>('forms/claims', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
        clientIp: getClientIp(context.request),
    })
    if (!result.ok) return json(result)
    if (!result.data?.code) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }

    const data = parsed.data as Record<string, unknown>
    const email = String(data.email || '')
    try {
        const mail = renderBookClaimConfirmation({
            firstName: String(data.first_name || ''),
            lastName: String(data.last_name || ''),
            code: result.data.code,
            receivedDate: String(data.received_date || ''),
            claimType: String(data.claim_type || ''),
            summary: String(data.summary || ''),
            description: String(data.description || ''),
        })
        await sendMail({ to: email, ...mail })
        return json(result)
    } catch (error) {
        console.error('[claims] no se pudo enviar la confirmación:', error)
        return json({ ...result, warnings: [emailDeliveryWarning()] })
    }
}
