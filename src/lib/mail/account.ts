import { emailLayout, escapeHtml } from './layout'

export function renderVerificationCode({ code }: { code: string }) {
    return {
        subject: 'Código de verificación',
        html: emailLayout({
            title: 'Código de verificación',
            content: `
                <p>Estimado usuario:</p>
                <p>
                    Para seguir con tu solicitud, ingresa este
                    <strong style="color:#2492c2;">código de verificación</strong> en la web.
                </p>
                <div style="margin:28px 0;padding:24px 12px;border:1px solid #f0f0f0;border-radius:12px;text-align:center;">
                    <p style="margin:0 0 8px;color:#9a9a9a;font-size:13px;">Tu código de verificación es</p>
                    <strong style="font-size:42px;letter-spacing:6px;color:#2492c2;">${escapeHtml(code)}</strong>
                </div>
            `,
        }),
    }
}
