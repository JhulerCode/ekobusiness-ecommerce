import { describe, expect, it } from 'vitest'
import {
    ORDER_CURRENCY,
    PARTNER_ORDER_ORIGIN,
    PARTNER_ORDER_TYPE,
    createPaymentSchema,
    partnerOrderTypeSchema,
} from '../../src/lib/api-schemas'
import { buildAuthoritativeCheckout } from '../../src/lib/server/checkout-quote'

function quote(overrides: Record<string, unknown> = {}) {
    return {
        quote_id: 'quote-1',
        expires_at: '2026-08-28T19:05:00.000Z',
        currency_id: 'PEN',
        is_club_member: false,
        partner_order_lines: [
            {
                article_id: 'product-1',
                name: 'Producto',
                unit: 'caja',
                quantity: 1,
                unit_price: 20,
                igv_affectation: 'gravado',
                igv_rate: 18,
                line_name: 'Tradicional',
                presentation: [{ label: 'Saquitos', value: 50 }],
            },
        ],
        ubigeo: null,
        ...overrides,
    }
}

function draft(overrides: Record<string, unknown> = {}) {
    return {
        type: 'sale',
        delivery_type: 'retiro',
        punto_retiro: 'planta-sunka',
        delivery_date: '2026-08-30',
        partner_order_lines: [{ article_id: 'product-1', quantity: 1 }],
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
        const order = buildAuthoritativeCheckout(draft(), quote(), context)
        expect(order.type).toBe('sale')
        expect(order.origin).toBe('integration')
        expect(order.currency_id).toBe('PEN')
    })

    it('rechaza el type legacy numérico', () => {
        expect(() =>
            buildAuthoritativeCheckout(draft({ type: 2 }), quote(), context),
        ).toThrow('INVALID_ORDER_TYPE')
    })

    it('rechaza origin, moneda, medio de pago y comprobante fuera de contrato', () => {
        expect(() =>
            buildAuthoritativeCheckout(draft({ origin: 'ecommerce' }), quote(), context),
        ).toThrow('INVALID_ORDER_ORIGIN')
        expect(() =>
            buildAuthoritativeCheckout(draft({ currency_id: 'USD' }), quote(), context),
        ).toThrow('INVALID_ORDER_CURRENCY')
        expect(() =>
            buildAuthoritativeCheckout(draft({ payment_method: 'efectivo' }), quote(), context),
        ).toThrow('INVALID_PAYMENT_METHOD')
        expect(() =>
            buildAuthoritativeCheckout(draft({ invoice_type: '99' }), quote(), context),
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

describe('cotización del checkout', () => {
    it('usa los precios de la cotización y propaga su identificador', () => {
        const order = buildAuthoritativeCheckout(
            draft({ partner_order_lines: [{ article_id: 'product-1', quantity: 1, unit_price: 1 }] }),
            quote(),
            context,
        )
        expect(order.quote_id).toBe('quote-1')
        expect(order.partner_order_lines).toEqual([
            {
                article_id: 'product-1',
                name: 'Producto',
                unit: 'caja',
                quantity: 1,
                unit_price: 20,
                igv_affectation: 'gravado',
                igv_rate: 18,
                blend_data: undefined,
            },
        ])
        expect(order.amount).toBe(20)
        expect(order.delivery_cost).toBe(0)
    })

    it('exige una cotización con líneas', () => {
        expect(() =>
            buildAuthoritativeCheckout(
                draft(),
                quote({ partner_order_lines: [], quote_id: '' }),
                context,
            ),
        ).toThrow('INVALID_CART')
    })

    it('calcula envío y promociones sobre la cotización', () => {
        const lines = [
            {
                article_id: 'product-1',
                name: 'Tradicional 50',
                unit: 'caja',
                quantity: 3,
                unit_price: 25,
                igv_affectation: 'gravado',
                igv_rate: 18,
                line_name: 'Tradicional',
                presentation: [{ label: 'Saquitos', value: 50 }],
            },
            {
                article_id: 'product-2',
                name: 'Tradicional 20',
                unit: 'caja',
                quantity: 2,
                unit_price: 25,
                igv_affectation: 'gravado',
                igv_rate: 18,
                line_name: 'Tradicional',
                presentation: [{ label: 'Saquitos', value: 20 }],
            },
        ]
        const order = buildAuthoritativeCheckout(
            draft({
                delivery_type: 'envio',
                delivery_ubigeo_id: '150101',
                partner_order_lines: lines.map((line) => ({
                    article_id: line.article_id,
                    quantity: line.quantity,
                })),
            }),
            quote({
                partner_order_lines: lines,
                ubigeo: { id: '150101', province: 'Lima', district: 'Miraflores' },
            }),
            context,
        )
        expect(order.delivery_cost).toBe(0)
        expect(order.promotions[0].key).toBe('tradicional-general')
        expect(order.delivery_address_data.ubigeo1.district).toBe('Miraflores')
    })

    it('rechaza entregas fuera de Lima con el ubigeo de la cotización', () => {
        expect(() =>
            buildAuthoritativeCheckout(
                draft({ delivery_type: 'envio', delivery_ubigeo_id: '040101' }),
                quote({
                    partner_order_lines: [
                        { article_id: 'product-1', name: 'Producto', quantity: 1, unit_price: 20 },
                    ],
                    ubigeo: { id: '040101', province: 'Arequipa' },
                }),
                context,
            ),
        ).toThrow('DELIVERY_OUTSIDE_LIMA')
    })
})
