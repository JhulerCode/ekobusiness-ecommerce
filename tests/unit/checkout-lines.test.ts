import { describe, expect, it } from 'vitest'
import { toOrderLines, toPromotionItems } from '../../src/lib/checkout-lines'
import { evaluateCheckoutPromotions } from '../../src/lib/checkout-promotions'

function cartItem() {
    return {
        articulo: 'product-1',
        name: 'Jengibre naranja 20 sobres',
        unit: 'UND',
        cantidad: 2,
        pu: 8.9,
        blend_datos: { intensidad: 2 },
        line_name: 'Tradicional',
        presentation: [{ label: 'Saquitos', value: 20 }],
    }
}

describe('líneas del checkout', () => {
    it('envía las líneas del pedido con el contrato del ERP', () => {
        expect(toOrderLines([cartItem()])).toEqual([
            {
                article_id: 'product-1',
                name: 'Jengibre naranja 20 sobres',
                unit: 'UND',
                quantity: 2,
                unit_price: 8.9,
                blend_data: { intensidad: 2 },
            },
        ])
    })

    it('habilita las promociones sobre las cantidades reales del carrito', () => {
        const items = [
            {
                ...cartItem(),
                line_name: 'Signature Black',
                cantidad: 5,
            },
        ]

        const quote = evaluateCheckoutPromotions(toPromotionItems(items))

        expect(quote.subtotal).toBe(44.5)
        expect(quote.matchedPromotions[0]?.key).toBe('signature-general')
        expect(quote.deliveryCost).toBe(0)
    })
})
