import { describe, expect, it } from 'vitest'
import { evaluateCheckoutPromotions } from '../../src/lib/checkout-promotions'

function item(line: string, presentation: number, quantity: number, price = 1) {
    return {
        linea_nombre: line,
        presentacion: [{ label: 'Saquitos', value: presentation }],
        cantidad: quantity,
        pu: price,
    }
}

describe('promociones del checkout', () => {
    it('aplica los mínimos de envío gratis para público general y Club', () => {
        expect(evaluateCheckoutPromotions([item('Tradicional', 20, 1, 74.99)]).deliveryCost).toBe(10)
        expect(evaluateCheckoutPromotions([item('Tradicional', 20, 1, 75)]).deliveryCost).toBe(0)
        expect(evaluateCheckoutPromotions([item('Tradicional', 20, 1, 65)], {
            isClubMember: true,
        }).deliveryCost).toBe(0)
    })

    it('acepta cantidades mayores al mínimo y productos distintos de una misma línea', () => {
        const quote = evaluateCheckoutPromotions([
            item('Tradicional', 50, 2, 2),
            item('Tradicional', 50, 2, 2),
            item('Tradicional', 20, 3, 2),
        ])
        expect(quote.deliveryCost).toBe(0)
        expect(quote.matchedPromotions.map((promotion) => promotion.key)).toContain('tradicional-general')
    })

    it('solo añade una caja sorpresa aunque coincidan varias promociones Club', () => {
        const quote = evaluateCheckoutPromotions([
            item('Piramidal Premium', 10, 4),
            item('Luxury', 10, 3),
        ], { isClubMember: true })
        expect(quote.matchedPromotions.length).toBeGreaterThan(1)
        expect(quote.benefits).toEqual([
            { type: 'caja_sorpresa', label: 'Caja sorpresa', quantity: 1 },
        ])
    })

    it('solo considera el valor cuya etiqueta es Saquitos', () => {
        const quote = evaluateCheckoutPromotions([{
            linea_nombre: 'Luxury',
            presentacion: [{ label: 'Peso', value: 10 }, { label: 'Saquitos', value: 50 }],
            cantidad: 3,
            pu: 1,
        }])
        expect(quote.matchedPromotions).toHaveLength(0)
        expect(quote.deliveryCost).toBe(10)
    })
})
