import { describe, expect, it } from 'vitest'
import { renderVerificationCode } from '@/lib/mail/account'
import { renderArcoConfirmation, renderBookClaimConfirmation } from '@/lib/mail/forms'
import { escapeHtml } from '@/lib/mail/layout'
import { renderOrderConfirmation, renderOrderLookupCode } from '@/lib/mail/order'

describe('correos del ecommerce', () => {
    it('escapa datos para no inyectar HTML', () => {
        expect(escapeHtml('<b>"x"</b>')).toBe('&lt;b&gt;&quot;x&quot;&lt;/b&gt;')
    })

    it('renderiza el código de verificación', () => {
        const mail = renderVerificationCode({ code: '123456' })
        expect(mail.subject).toBe('Código de verificación')
        expect(mail.html).toContain('123456')
        expect(mail.html).toContain('SUNKA Herbal Tea')
    })

    it('renderiza el código de consulta con su vencimiento', () => {
        const mail = renderOrderLookupCode({
            name: 'Ana <Pérez>',
            orderCode: '261101000001',
            lookupCode: '654321',
            expiresAt: '2026-12-16T00:00:00.000Z',
            siteUrl: 'https://tienda.example',
        })
        expect(mail.subject).toContain('261101000001')
        expect(mail.html).toContain('654321')
        expect(mail.html).toContain('Ana &lt;Pérez&gt;')
        expect(mail.html).toContain('https://tienda.example/consulta-pedido')
    })

    it('renderiza la confirmación con líneas y enlace de acceso', () => {
        const mail = renderOrderConfirmation({
            order: {
                id: 'order-1',
                code: '261101000002',
                amount: 42.9,
                delivery_type: 'envio',
                partner_data: { name: 'Ana', email: 'ana@example.com' },
                partner_order_lines: [
                    { name: 'Té verde', quantity: 2, unit_price: 12.5 },
                ],
            },
            lookupCode: '111222',
            accessToken: 'token-1',
            baseUrl: 'https://tienda.example',
        })
        expect(mail.subject).toContain('261101000002')
        expect(mail.html).toContain('111222')
        expect(mail.html).toContain('Té verde')
        expect(mail.html).toContain('S/ 42.90')
        expect(mail.html).toContain('/api/pedidos/acceso?id=order-1&amp;token=token-1')
    })

    it('renderiza las confirmaciones ARCO y de reclamo', () => {
        const arco = renderArcoConfirmation({
            firstName: 'Ana',
            lastName: 'Pérez',
            code: 'ARCO-1',
            receivedDate: '2026-11-16',
            requestType: 'Acceso',
            email: 'ana@example.com',
        })
        expect(arco.subject).toContain('ARCO-1')
        expect(arco.html).toContain('Acceso')
        expect(arco.html).toContain('ana@example.com')

        const claim = renderBookClaimConfirmation({
            firstName: 'Ana',
            lastName: 'Pérez',
            code: 'REC-1',
            receivedDate: '2026-11-16',
            claimType: 'Reclamo',
            summary: 'Producto',
            description: 'Detalle',
        })
        expect(claim.subject).toContain('REC-1')
        expect(claim.html).toContain('Producto')
        expect(claim.html).toContain('Detalle')
    })
})
