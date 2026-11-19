import type { APIRoute } from 'astro'
import { allowedUploadTypes, arcoMetadataSchema, maxUploadBytes } from '@/lib/api-schemas'
import { backendRequest, getClientIp } from '@/lib/server/backend'
import {
    emailDeliveryWarning,
    assertSameOrigin,
    forbiddenOrigin,
    invalidCaptcha,
    invalidRequest,
    failure,
    json,
} from '@/lib/server/bff'
import { verifyCaptcha } from '@/lib/server/captcha'
import { renderArcoConfirmation } from '@/lib/mail/forms'
import { sendMail } from '@/lib/server/mail'

const fileFields = new Set(['identity_document_file', 'representative_document_file', 'additional_documents', 'archivo', 'archivos'])

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    let incoming: FormData
    try {
        incoming = await context.request.formData()
    } catch {
        return invalidRequest()
    }

    const rawMetadata = incoming.get('datos')
    let metadata: unknown
    try {
        metadata = typeof rawMetadata === 'string' ? JSON.parse(rawMetadata) : undefined
    } catch {
        return invalidRequest()
    }
    if (!arcoMetadataSchema.safeParse(metadata).success) return invalidRequest()

    const payload = metadata as Record<string, unknown>
    const outgoing = new FormData()
    let fileCount = 0
    for (const [name, value] of incoming.entries()) {
        if (name === 'datos') continue
        if (!(value instanceof File) || !fileFields.has(name)) return invalidRequest()
        if (!allowedUploadTypes.has(value.type) || value.size > maxUploadBytes || ++fileCount > 3) {
            return invalidRequest()
        }
        outgoing.append(name, value, value.name)
    }

    const clientIp = getClientIp(context.request)
    if (!(await verifyCaptcha(payload.captcha, clientIp))) {
        return invalidCaptcha()
    }
    const { captcha: _captcha, ...forwarded } = payload
    outgoing.set('datos', JSON.stringify(forwarded))

    const result = await backendRequest<{ id: string; code: string }>('forms/arco', {
        method: 'POST',
        body: outgoing,
        clientIp,
    })
    if (!result.ok) return json(result)
    if (!result.data?.code) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }

    const email = String(payload.email || '')
    try {
        const mail = renderArcoConfirmation({
            firstName: String(payload.first_name || ''),
            lastName: String(payload.last_name || ''),
            code: result.data.code,
            receivedDate: String(payload.received_date || ''),
            requestType: String(payload.request_type || ''),
            email,
        })
        await sendMail({ to: email, ...mail })
        return json(result)
    } catch (error) {
        console.error('[arco] no se pudo enviar la confirmación:', error)
        return json({ ...result, warnings: [emailDeliveryWarning()] })
    }
}
