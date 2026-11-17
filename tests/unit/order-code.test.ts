import { describe, expect, it } from 'vitest'
import { generateOrderCode } from '../../src/lib/server/order-code'

describe('código de pedido del ecommerce', () => {
    it('genera YYMMDD y seis dígitos con la fecha de Lima', () => {
        expect(
            generateOrderCode({
                now: new Date('2026-08-28T19:00:00.000Z'),
                random: () => 123456,
            }),
        ).toBe('260828123456')
    })

    it('usa el día de Lima aunque en UTC ya sea el siguiente', () => {
        expect(
            generateOrderCode({
                now: new Date('2026-08-29T03:00:00.000Z'),
                random: () => 7,
            }),
        ).toBe('260828000007')
    })

    it('siempre devuelve doce dígitos numéricos', () => {
        expect(generateOrderCode({ random: () => 0 })).toMatch(/^[0-9]{12}$/)
        expect(generateOrderCode({ random: () => 999999 })).toMatch(/^[0-9]{12}$/)
    })
})
