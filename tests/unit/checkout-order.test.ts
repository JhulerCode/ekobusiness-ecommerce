import { describe, expect, it } from 'vitest'
import {
    ORDER_CURRENCY,
    PARTNER_ORDER_ORIGIN,
    PARTNER_ORDER_TYPE,
    createPaymentSchema,
    partnerOrderTypeSchema,
} from '../../src/lib/api-schemas'
import { buildCheckoutDraft } from '../../src/lib/server/checkout-order'

function draft(overrides: Record<string, unknown> = {}) {
    return {
        type: 'sale',
        delivery_type: 'retiro',
        punto_retiro: 'planta-sunka',
        delivery_date: '2026-08-30',
        partner_order_lines: [
            {
                article_id: 'product-1',
                quantity: 1,
                unit_price: 20,
                line_name: 'Tradicional',
                presentation: [{ label: 'Saquitos', value: 50 }],
            },
        ],
        ...overrides,
    }
}

const context = { now: new Date('2026-08-28T19:00:00.000Z') }

describe('contrato partnerOrder.type con integration', () => {
    it('define sale como único tipo válido del checkout', () => {
        expect(PARTNER_ORDER_TYPE).toBe('sale')
        expect(partnerOrderTypeSchema.safeParse('sale').success).toBe(true)
        expect(partnerOrderTypeSchema.safeParse(2).success).toBe(false)
        expect(partnerOrderTypeSchema.safeParse('purchase').success).toBe(false)
    })

    it('normaliza type y origin hacia el contrato del ERP', () => {
        const order = buildCheckoutDraft(draft(), context)
        expect(order.type).toBe('sale')
        expect(order.origin).toBe('integration')
        expect(order.currency_id).toBe('PEN')
    })

    it('rechaza el type legacy numérico', () => {
        expect(() => buildCheckoutDraft(draft({ type: 2 }), context)).toThrow(
            'INVALID_ORDER_TYPE',
        )
    })

    it('rechaza origin, moneda, medio de pago y comprobante fuera de contrato', () => {
        expect(() =>
            buildCheckoutDraft(draft({ origin: 'ecommerce' }), context),
        ).toThrow('INVALID_ORDER_ORIGIN')
        expect(() =>
            buildCheckoutDraft(draft({ currency_id: 'USD' }), context),
        ).toThrow('INVALID_ORDER_CURRENCY')
        expect(() =>
            buildCheckoutDraft(draft({ payment_method: 'efectivo' }), context),
        ).toThrow('INVALID_PAYMENT_METHOD')
        expect(() =>
            buildCheckoutDraft(draft({ invoice_type: '99' }), context),
        ).toThrow('INVALID_INVOICE_TYPE')
    })

    it('los schemas del BFF rechazan literales fuera de contrato', () => {
        expect(PARTNER_ORDER_ORIGIN).toBe('integration')
        expect(ORDER_CURRENCY).toBe('PEN')
        expect(
            createPaymentSchema.safeParse({
                email: 'a@b.pe',
                partner_order: { type: 2 },
            }).success,
        ).toBe(false)
        expect(
            createPaymentSchema.safeParse({
                email: 'a@b.pe',
                partner_order: { type: 'sale', payment_method: 'yape', invoice_type: '03' },
            }).success,
        ).toBe(false)
        expect(
            createPaymentSchema.safeParse({
                email: 'a@b.pe',
                partner_order: { type: 'sale', payment_method: 'tarjeta', invoice_type: '03' },
            }).success,
        ).toBe(true)
        expect(
            createPaymentSchema.safeParse({
                email: 'a@b.pe',
                partner_order: { type: 'purchase' },
            }).success,
        ).toBe(false)
    })
})

describe('preparación del pedido del checkout', () => {
    it('conserva el precio visto para que el ERP lo revalide', () => {
        const order = buildCheckoutDraft(
            draft({ partner_order_lines: [{ article_id: 'product-1', quantity: 1, unit_price: 1 }] }),
            context,
        )
        expect(order.partner_order_lines).toEqual([
            {
                article_id: 'product-1',
                quantity: 1,
                unit_price: 1,
            },
        ])
        expect(order.amount).toBe(1)
        expect(order.delivery_cost).toBe(0)
    })

    it('exige líneas con artículo, cantidad y precio válidos', () => {
        for (const partner_order_lines of [
            [],
            [{ article_id: '', quantity: 1, unit_price: 20 }],
            [{ article_id: 'product-1', quantity: 0, unit_price: 20 }],
            [{ article_id: 'product-1', quantity: 1 }],
            [{ article_id: 'product-1', quantity: 1, unit_price: -1 }],
        ]) {
            expect(() => buildCheckoutDraft(draft({ partner_order_lines }), context)).toThrow(
                'INVALID_CART',
            )
        }
    })

    it('calcula envío y promociones con los precios vistos', () => {
        const order = buildCheckoutDraft(
            draft({
                delivery_type: 'envio',
                delivery_ubigeo_id: '150101',
                partner_order_lines: [
                    {
                        article_id: 'product-1',
                        quantity: 3,
                        unit_price: 25,
                        line_name: 'Tradicional',
                        presentation: [{ label: 'Saquitos', value: 50 }],
                    },
                    {
                        article_id: 'product-2',
                        quantity: 2,
                        unit_price: 25,
                        line_name: 'Tradicional',
                        presentation: [{ label: 'Saquitos', value: 20 }],
                    },
                ],
            }),
            context,
        )
        expect(order.delivery_cost).toBe(0)
        expect(order.promotions[0].key).toBe('tradicional-general')
    })

    it('atribuye el pedido de invitado al socio del servidor y descarta el del navegador', () => {
        const order = buildCheckoutDraft(
            draft({ partner_id: 'partner-manipulado' }),
            { ...context, guestPartnerId: 'partner-invitado' },
        )
        expect(order.partner_id).toBe('partner-invitado')

        const member = buildCheckoutDraft(
            draft({ partner_id: 'partner-manipulado' }),
            { ...context, isClubMember: true },
        )
        expect(member.partner_id).toBeUndefined()
    })

    it('el servidor rechaza una fecha anterior a la permitida', () => {
        expect(() =>
            buildCheckoutDraft(
                draft({ delivery_date: '2026-08-29' }),
                { now: new Date('2026-08-28T21:00:00.000Z') },
            ),
        ).toThrow('INVALID_DELIVERY_DATE')
    })

    it('el servidor guarda el punto de retiro oficial y descarta una dirección manipulada', () => {
        const order = buildCheckoutDraft(
            draft({
                delivery_address: 'Dirección inventada',
                delivery_address_data: {
                    punto_retiro: { name: 'Local inventado' },
                    horario: 'Todo el día',
                },
            }),
            context,
        )

        expect(order.delivery_address).toBe(
            'Cal. 7 Mza. D Lote 10 Urb. Los Productores, Santa Anita',
        )
        expect(order.delivery_address_data).toEqual({
            punto_retiro: {
                id: 'planta-sunka',
                name: 'Planta Sunka',
                direccion: 'Cal. 7 Mza. D Lote 10 Urb. Los Productores, Santa Anita',
            },
            horario: '8:00 a. m. a 4:00 p. m.',
        })
    })

    it('el servidor rechaza puntos de retiro que no pertenecen al catálogo', () => {
        expect(() =>
            buildCheckoutDraft(draft({ punto_retiro: 'local-inventado' }), context),
        ).toThrow('INVALID_PICKUP_LOCATION')
    })
})
