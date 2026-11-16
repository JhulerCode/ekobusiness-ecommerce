import { emailLayout, escapeHtml, mailBrand } from './layout'

type OrderLine = {
    name?: string
    quantity?: number | string
    unit_price?: number | string
}

export type MailOrder = {
    id?: string
    code?: string
    amount?: number | string
    delivery_type?: string
    partner_data?: { name?: string; email?: string }
    partner_order_lines?: OrderLine[]
}

function formatAmount(value: unknown) {
    return `S/ ${Number(value || 0).toFixed(2)}`
}

function formatDate(value: unknown) {
    if (!value) return ''
    const date = new Date(String(value))
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

function deliveryName(value: unknown) {
    if (value === 'envio') return 'Envío a domicilio'
    if (value === 'retiro') return 'Retiro en tienda'
    return String(value || '')
}

function orderLines(lines: OrderLine[] = []) {
    if (!lines.length) return ''
    return `
        <div style="margin-top:24px;">
            <h2 style="font-size:16px;margin:0 0 12px;">Detalle de productos</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
                ${lines.map((line) => `
                    <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
                            ${escapeHtml(line.name)}
                        </td>
                        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;white-space:nowrap;">
                            x${escapeHtml(line.quantity)}
                        </td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `
}

export function renderOrderLookupCode({
    name,
    orderCode,
    lookupCode,
    expiresAt,
    siteUrl = mailBrand.siteUrl,
}: {
    name?: string
    orderCode: string
    lookupCode: string
    expiresAt: string
    siteUrl?: string
}) {
    const expiry = formatDate(expiresAt)
    return {
        subject: `Código de consulta - Pedido Nro ${orderCode}`,
        html: emailLayout({
            title: 'Código de consulta',
            content: `
                <p>Estimado/a ${escapeHtml(name || 'cliente')},</p>
                <p>Recibimos tu solicitud para consultar el pedido <strong>${escapeHtml(orderCode)}</strong>.</p>
                <div style="margin:28px 0;padding:24px 12px;border:1px solid #f0f0f0;border-radius:12px;text-align:center;">
                    <p style="margin:0 0 8px;color:#9a9a9a;font-size:13px;">Tu código de consulta es</p>
                    <strong style="font-size:42px;letter-spacing:6px;color:#2492c2;">${escapeHtml(lookupCode)}</strong>
                    ${expiry ? `<p style="margin:12px 0 0;color:#9a9a9a;font-size:13px;">Vence el ${escapeHtml(expiry)}</p>` : ''}
                </div>
                <p>No compartas este código. Si no solicitaste este reenvío, ignora este correo.</p>
                <div style="margin-top:24px;text-align:center;">
                    <a href="${escapeHtml(`${siteUrl}/consulta-pedido`)}" style="display:inline-block;padding:12px 22px;border-radius:24px;background:#2492c2;color:#ffffff;text-decoration:none;font-weight:700;">
                        Consultar mi pedido
                    </a>
                </div>
            `,
        }),
    }
}

export function renderOrderConfirmation({
    order,
    lookupCode,
    accessToken,
    baseUrl,
}: {
    order: MailOrder
    lookupCode: string
    accessToken: string
    baseUrl: string
}) {
    const orderCode = String(order.code || '')
    const orderUrl = order.id
        ? `${baseUrl.replace(/\/$/, '')}/api/pedidos/acceso?id=${encodeURIComponent(order.id)}&token=${encodeURIComponent(accessToken)}`
        : `${mailBrand.siteUrl}/consulta-pedido`

    return {
        subject: `Confirmación de compra - Pedido Nro ${orderCode}`,
        html: emailLayout({
            title: 'Confirmación de compra',
            content: `
                <p>Estimado/a ${escapeHtml(order.partner_data?.name || 'cliente')},</p>
                <p>
                    Hemos confirmado su pago y registrado su compra en nuestra
                    <strong style="color:#2492c2;">tienda online</strong>.
                </p>
                <div style="margin:24px 0;padding:18px;border:1px solid #f0f0f0;border-radius:12px;">
                    <strong>Nro de pedido:</strong> ${escapeHtml(orderCode)}<br />
                    <strong>Código de consulta:</strong> ${escapeHtml(lookupCode)}<br />
                    <strong>Tipo de entrega:</strong> ${escapeHtml(deliveryName(order.delivery_type))}<br />
                    <strong>Importe:</strong> ${formatAmount(order.amount)}<br />
                </div>
                <p>Para consultar tu pedido como invitado, usa el número de pedido y el código de seis dígitos. El código vence en 30 días y no debes compartirlo.</p>
                ${orderLines(order.partner_order_lines)}
                <div style="margin-top:24px;padding:18px;background:#f5f5f5;border-radius:12px;text-align:center;">
                    <p style="margin:0 0 12px;">Comenzaremos a preparar tu pedido y te mantendremos al tanto de cualquier novedad.</p>
                    <a href="${escapeHtml(orderUrl)}" style="display:inline-block;padding:12px 22px;border-radius:24px;background:#2492c2;color:#ffffff;text-decoration:none;font-weight:700;">
                        Consultar mi pedido
                    </a>
                </div>
            `,
        }),
    }
}
