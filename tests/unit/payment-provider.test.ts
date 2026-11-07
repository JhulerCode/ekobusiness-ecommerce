import { afterEach, describe, expect, it } from 'vitest'
import { activePaymentProvider } from '@/lib/server/paymentProvider'

const original = process.env.PAYMENT_PROVIDER

afterEach(() => {
    if (original === undefined) delete process.env.PAYMENT_PROVIDER
    else process.env.PAYMENT_PROVIDER = original
})

describe('proveedor de pagos del ecommerce', () => {
    it('resuelve el proveedor desde PAYMENT_PROVIDER y cae en Izipay', () => {
        process.env.PAYMENT_PROVIDER = 'niubiz'
        expect(activePaymentProvider()).toBe('niubiz')

        process.env.PAYMENT_PROVIDER = ' IZIPAY '
        expect(activePaymentProvider()).toBe('izipay')

        process.env.PAYMENT_PROVIDER = 'desconocido'
        expect(activePaymentProvider()).toBe('izipay')

        delete process.env.PAYMENT_PROVIDER
        expect(activePaymentProvider()).toBe('izipay')
    })
})
