import type { APIRoute } from 'astro'
import { accountCodeSchema } from '@/lib/api-schemas'
import { requestWithSession } from '@/lib/server/backend'
import { failure, invalidRequest, json, parseJson } from '@/lib/server/bff'
import { renderVerificationCode } from '@/lib/mail/account'
import { sendMail } from '@/lib/server/mail'

export const POST: APIRoute = async (context) => {
    const parsed = await parseJson(context.request, accountCodeSchema)
    if (!parsed.success) return invalidRequest()

    const result = await requestWithSession<{ email?: string; verification_code?: string }>(
        context,
        'customers/me/verification-code',
        { method: 'POST', body: JSON.stringify(parsed.data) },
    )
    if (!result.ok) return json(result)

    const { email, verification_code } = result.data || {}
    if (!email || !verification_code) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }

    try {
        await sendMail({ to: email, ...renderVerificationCode({ code: verification_code }) })
        return json({ ok: true, status: 204 })
    } catch (error) {
        console.error('[send-codigo] no se pudo enviar el código:', error)
        return json(failure(502, 'mail-unavailable', 'Correo no disponible', 'No se pudo enviar el código de verificación.'))
    }
}
