import { describe, expect, it } from 'vitest'
import {
    ORDER_CURRENCY,
    PARTNER_ORDER_ORIGIN,
    PARTNER_ORDER_TYPE,
    createPaymentSchema,
    orderCreateSchema,
    partnerOrderTypeSchema,
} from '../../src/lib/api-schemas'
import { buildAuthoritativeCheckout } from '../../src/lib/server/checkout-quote'

function product() {
    return {
        id: 'product-1',
        name: 'Producto',
        price: 20,
        list_price: 20,
        ecommerce_data: { price: 20, presentation: [] },
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

const context = { isClubMember: false, now: new Date('2026-08-28T19:00:00.000Z') }

describe('contrato partnerOrder.type con integration', () => {
    it('define sale como único tipo válido del checkout', () => {
        expect(PARTNER_ORDER_TYPE).toBe('sale')
        expect(partnerOrderTypeSchema.safeParse('sale').success).toBe(true)
        expect(partnerOrderTypeSchema.safeParse(2).success).toBe(false)
        expect(partnerOrderTypeSchema.safeParse('purchase').success).toBe(false)
    })

    it('normaliza type y origin hacia el contrato del ERP', () => {
        const order = buildAuthoritativeCheckout(draft(), [product()], context)
        expect(order.type).toBe('sale')
        expect(order.origin).toBe('integration')
        expect(order.currency_id).toBe('PEN')
    })

    it('rechaza el type legacy numérico', () => {
        expect(() => buildAuthoritativeCheckout(draft({ type: 2 }), [product()], context)).toThrow(
            'INVALID_ORDER_TYPE',
        )
    })

    it('rechaza origin, moneda, medio de pago y comprobante fuera de contrato', () => {
        expect(() =>
            buildAuthoritativeCheckout(draft({ origin: 'ecommerce' }), [product()], context),
        ).toThrow('INVALID_ORDER_ORIGIN')
        expect(() =>
            buildAuthoritativeCheckout(draft({ currency_id: 'USD' }), [product()], context),
        ).toThrow('INVALID_ORDER_CURRENCY')
        expect(() =>
            buildAuthoritativeCheckout(draft({ payment_method: 'efectivo' }), [product()], context),
        ).toThrow('INVALID_PAYMENT_METHOD')
        expect(() =>
            buildAuthoritativeCheckout(draft({ invoice_type: '99' }), [product()], context),
        ).toThrow('INVALID_INVOICE_TYPE')
    })

    it('los schemas del BFF rechazan literales fuera de contrato', () => {
        expect(PARTNER_ORDER_ORIGIN).toBe('integration')
        expect(ORDER_CURRENCY).toBe('PEN')
        expect(
            orderCreateSchema.safeParse({
                order_code: 'abc',
                partner_data: {},
                type: 2,
            }).success,
        ).toBe(false)
        expect(
            orderCreateSchema.safeParse({
                order_code: 'abc',
                partner_data: {},
                type: 'sale',
                payment_method: 'yape',
                invoice_type: '03',
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
