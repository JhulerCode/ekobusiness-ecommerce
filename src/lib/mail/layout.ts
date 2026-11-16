export const mailBrand = {
    name: 'SUNKA Herbal Tea',
    email: 'comercial@sunkatea.com',
    whatsapp: '+51 999 888 777',
    siteUrl: 'https://sunka.pe',
    primary: '#2492c2',
}

export function escapeHtml(value: unknown) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
}

export function emailLayout({ title, content }: { title: string; content: string }) {
    return `<!doctype html>
<html lang="es">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
    </head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:Roboto,Helvetica,Arial,sans-serif;color:#3c3c3b;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:24px 12px;">
            <tr>
                <td align="center">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:8px;padding:28px;">
                        <tr>
                            <td style="text-align:center;font-size:26px;font-weight:700;padding-bottom:20px;">
                                ${escapeHtml(mailBrand.name)}
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size:15px;line-height:1.55;">
                                ${content}
                            </td>
                        </tr>
                    </table>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin-top:20px;text-align:center;font-size:12px;color:#6b6b6b;">
                        <tr>
                            <td style="line-height:1.6;">
                                Atentamente<br />${escapeHtml(mailBrand.name)}<br /><br />
                                Correo: ${escapeHtml(mailBrand.email)}<br />
                                WhatsApp: ${escapeHtml(mailBrand.whatsapp)}<br /><br />
                                © ${new Date().getFullYear()} ${escapeHtml(mailBrand.name)}. Todos los derechos reservados.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>`
}
