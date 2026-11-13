import { describe, expect, it } from 'vitest'
import { createCheckoutOrderSignature } from '../../src/lib/checkout-draft'

function snapshot(overrides: Record<string, any> = {}) {
    return {
        items: [
            {
                articulo: 'product-1',
                cantidad: 2,
                pu: 10,
                blend_datos: null,
            },
        ],
        form: {
            partner_data: {
                email: 'cliente@example.com',
                phone1: '999999999',
                name: 'Cliente',
                apellidos: 'Prueba',
                document_type: 1,
                document_number: '12345678',
            },
            delivery_type: 'envio',
            punto_retiro: null,
            delivery_date: '2026-11-20',
            entrega_ubigeo: '150101',
            direccion_entrega: 'Av. Siempre Viva',
            entrega_direccion_datos: {
                numero: '123',
                piso: 'A',
                referencia: 'Portón negro',
                horario: '8:00 a. m. a 4:00 p. m.',
                ubigeo1: {
                    id: '150101',
                    full_name: 'Lima - Lima - Lima',
                    department: 'LIMA',
                    province: 'LIMA',
                    district: 'LIMA',
                    nombre: 'LIMA',
                },
            },
            invoice_type: '03',
            invoice_ruc: '',
            invoice_business_name: '',
            payment_method: 'tarjeta',
            paymentMethodToken: 'nueva',
        },
        deliveryCost: 0,
        ...overrides,
    }
}

function signature(overrides: Record<string, any> = {}) {
    const data = snapshot(overrides)
    return createCheckoutOrderSignature({
        items: data.items,
        form: data.form,
        deliveryCost: data.deliveryCost,
    })
}

describe('firma del pedido del checkout', () => {
    it('es estable con los mismos datos', () => {
        expect(signature()).toBe(signature())
    })

    it('cambia cuando cambia la entrega', () => {
        const base = signature()
        expect(signature({ form: { ...snapshot().form, delivery_type: 'retiro' } })).not.toBe(base)
        expect(
            signature({ form: { ...snapshot().form, delivery_date: '2026-11-21' } }),
        ).not.toBe(base)
        expect(signature({ deliveryCost: 8 })).not.toBe(base)
    })

    it('cambia cuando cambia el comprobante o la tarjeta', () => {
        const base = signature()
        expect(
            signature({ form: { ...snapshot().form, invoice_type: '01', invoice_ruc: '20123456789' } }),
        ).not.toBe(base)
        expect(
            signature({ form: { ...snapshot().form, paymentMethodToken: 'card-token' } }),
        ).not.toBe(base)
    })

    it('cambia cuando cambian las líneas', () => {
        const base = signature()
        expect(
            signature({ items: [{ articulo: 'product-1', cantidad: 3, pu: 10 }] }),
        ).not.toBe(base)
    })

    it('ignora el orden de las líneas', () => {
        const first = signature({
            items: [
                { articulo: 'product-1', cantidad: 1, pu: 10 },
                { articulo: 'product-2', cantidad: 1, pu: 20 },
            ],
        })
        const second = signature({
            items: [
                { articulo: 'product-2', cantidad: 1, pu: 20 },
                { articulo: 'product-1', cantidad: 1, pu: 10 },
            ],
        })
        expect(first).toBe(second)
    })

    it('ignora campos accesorios del ubigeo', () => {
        const form = snapshot().form
        const withExtra = {
            ...form,
            entrega_direccion_datos: {
                ...form.entrega_direccion_datos,
                ubigeo1: {
                    ...form.entrega_direccion_datos.ubigeo1,
                    nombre: 'OTRO',
                    extra: 'no persistido',
                },
            },
        }
        expect(signature({ form: withExtra })).toBe(signature())
    })
})
