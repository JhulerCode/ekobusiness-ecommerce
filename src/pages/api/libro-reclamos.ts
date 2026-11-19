import type { APIRoute } from 'astro'
import { complaintSchema } from '@/lib/api-schemas'
import { backendRequest, getClientIp } from '@/lib/server/backend'
import {
    emailDeliveryWarning,
    failure,
    assertSameOrigin,
    forbiddenOrigin,
    invalidCaptcha,
    invalidRequest,
    json,
    parseJson,
} from '@/lib/server/bff'
import { verifyCaptcha } from '@/lib/server/captcha'
import { renderBookClaimConfirmation } from '@/lib/mail/forms'
import { sendMail } from '@/lib/server/mail'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, complaintSchema)
    if (!parsed.success) return invalidRequest()

    const payload = parsed.data as Record<string, unknown>
    const clientIp = getClientIp(context.request)
    if (!(await verifyCaptcha(payload.captcha, clientIp))) {
        return invalidCaptcha()
    }
    const { captcha: _captcha, ...forwarded } = payload

    const result = await backendRequest<{ id: string; code: string }>('forms/claims', {
        method: 'POST',
        body: JSON.stringify(forwarded),
        clientIp,
    })
    if (!result.ok) return json(result)
    if (!result.data?.code) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }

    const email = String(payload.email || '')
    try {
        const mail = renderBookClaimConfirmation({
            firstName: String(payload.first_name || ''),
            lastName: String(payload.last_name || ''),
            code: result.data.code,
            receivedDate: String(payload.received_date || ''),
            claimType: String(payload.claim_type || ''),
            summary: String(payload.summary || ''),
            description: String(payload.description || ''),
        })
        await sendMail({ to: email, ...mail })
        return json(result)
    } catch (error) {
        console.error('[claims] no se pudo enviar la confirmación:', error)
        return json({ ...result, warnings: [emailDeliveryWarning()] })
    }
}
