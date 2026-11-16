import { emailLayout, escapeHtml } from './layout'

function formatDate(value: unknown) {
    if (!value) return ''
    const date = new Date(String(value))
    if (Number.isNaN(date.getTime())) return String(value)
    return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

export function renderArcoConfirmation({
    firstName,
    lastName,
    code,
    receivedDate,
    requestType,
    email,
}: {
    firstName: string
    lastName: string
    code: string
    receivedDate: string
    requestType: string
    email: string
}) {
    return {
        subject: `Confirmación de su solicitud de Derechos ARCO — Código ${code}`,
        html: emailLayout({
            title: 'Solicitud ARCO',
            content: `
                <p>Estimado/a ${escapeHtml(firstName)} ${escapeHtml(lastName)},</p>
                <p>
                    Hemos recibido correctamente su solicitud de ejercicio de
                    <strong style="color:#2492c2;">Derechos ARCO</strong>
                    (Acceso, Rectificación, Cancelación u Oposición).
                </p>
                <div style="margin:24px 0;padding:18px;border:1px solid #f0f0f0;border-radius:12px;">
                    <strong>Código de solicitud:</strong> ${escapeHtml(code)}<br />
                    <strong>Fecha de recepción:</strong> ${escapeHtml(formatDate(receivedDate))}<br />
                    <strong>Tipo de solicitud:</strong> ${escapeHtml(requestType)}<br />
                    <strong>Correo registrado:</strong> ${escapeHtml(email)}<br />
                </div>
                <p>
                    Nuestro equipo de Protección de Datos revisará su solicitud y le
                    brindará una respuesta dentro del plazo máximo establecido por la
                    <strong>Ley N° 29733 – Ley de Protección de Datos Personales</strong>.
                </p>
            `,
        }),
    }
}

export function renderBookClaimConfirmation({
    firstName,
    lastName,
    code,
    receivedDate,
    claimType,
    summary,
    description,
}: {
    firstName: string
    lastName: string
    code: string
    receivedDate: string
    claimType: string
    summary: string
    description: string
}) {
    return {
        subject: `Confirmación de registro Libro de reclamaciones - Código ${code}`,
        html: emailLayout({
            title: 'Libro de reclamaciones',
            content: `
                <p>Estimado/a ${escapeHtml(firstName)} ${escapeHtml(lastName)},</p>
                <p>
                    Hemos recibido correctamente su registro en nuestro
                    <strong style="color:#2492c2;">Libro de Reclamaciones</strong>.
                </p>
                <div style="margin:24px 0;padding:18px;border:1px solid #f0f0f0;border-radius:12px;">
                    <strong>Código de solicitud:</strong> ${escapeHtml(code)}<br />
                    <strong>Fecha de recepción:</strong> ${escapeHtml(formatDate(receivedDate))}<br />
                    <strong>Tipo de solicitud:</strong> ${escapeHtml(claimType)}<br />
                    <strong>Resumen:</strong> ${escapeHtml(summary)}<br />
                    <strong>Detalle:</strong> ${escapeHtml(description)}<br />
                </div>
                <p>
                    Nuestro equipo revisará su caso y le brindará una respuesta dentro
                    del plazo máximo establecido por <strong>INDECOPI</strong>.
                </p>
                <p>Agradecemos su tiempo y la confianza en nosotros para mejorar continuamente nuestro servicio.</p>
            `,
        }),
    }
}
