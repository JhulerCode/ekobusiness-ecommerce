import { describe, expect, it } from 'vitest'
import {
    CHECKOUT_PROMOTION_RULES,
    evaluateCheckoutPromotions,
    getPromotionRequirementText,
    getPromotionShopHref,
} from '../../src/lib/checkout-promotions'
import { buildAuthoritativeCheckout } from '../../src/lib/server/checkout-quote'
import {
    getMinimumDeliveryDate,
    isDeliveryDateAllowed,
} from '../../src/lib/delivery-date'

function item(line: string, presentation: number, quantity: number, price = 1) {
    return {
        line_name: line,
        presentation: [{ label: 'Saquitos', value: presentation }],
        quantity,
        unit_price: price,
    }
}

describe('promociones del checkout', () => {
    it('calcula la primera fecha según la hora de Lima', () => {
        const beforeCutoff = new Date('2026-08-28T20:59:00.000Z')
        const atCutoff = new Date('2026-08-28T21:00:00.000Z')

        expect(getMinimumDeliveryDate(beforeCutoff)).toBe('2026-08-29')
        expect(getMinimumDeliveryDate(atCutoff)).toBe('2026-08-30')
        expect(isDeliveryDateAllowed('2026-08-29', beforeCutoff)).toBe(true)
        expect(isDeliveryDateAllowed('2026-08-29', atCutoff)).toBe(false)
    })

    it('expone el mismo catálogo usado por el checkout para comunicar las condiciones', () => {
        const promotion = CHECKOUT_PROMOTION_RULES.find((rule) => rule.key === 'luxury-moment')

        expect(promotion).toBeDefined()
        expect(getPromotionRequirementText(promotion!)).toBe(
            '2 cajas Luxury de 10 saquitos y 1 caja Piramidal Premium de 10 saquitos',
        )
        expect(getPromotionShopHref(promotion!)).toBe(
            '/tienda?linea=luxury,piramidal-premium',
        )
    })

    it('aplica los mínimos de envío gratis para público general y Club', () => {
        expect(evaluateCheckoutPromotions([item('Tradicional', 20, 1, 74.99)]).deliveryCost).toBe(10)
        expect(evaluateCheckoutPromotions([item('Tradicional', 20, 1, 75)]).deliveryCost).toBe(0)
        expect(evaluateCheckoutPromotions([item('Tradicional', 20, 1, 65)], {
            isClubMember: true,
        }).deliveryCost).toBe(0)
    })

    it('registra el motivo del envío gratuito por monto', () => {
        const quote = evaluateCheckoutPromotions([item('Tradicional', 20, 1, 75)])
        expect(quote.appliedPromotions).toEqual([{
            key: 'free-shipping-general',
            name: 'Envío gratis por compras desde S/ 75',
            benefits: [{ type: 'envio_gratis', label: 'Envío gratis' }],
        }])
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

    it('selecciona una sola combinación y detalla sus beneficios', () => {
        const quote = evaluateCheckoutPromotions([
            item('Piramidal Premium', 10, 4),
            item('Luxury', 10, 3),
        ], { isClubMember: true })
        expect(quote.matchedPromotions.map((promotion) => promotion.key)).toEqual([
            'premium-luxury',
        ])
        expect(quote.appliedPromotions).toEqual([{
            key: 'premium-luxury',
            name: 'Premium & Luxury',
            benefits: [
                { type: 'envio_gratis', label: 'Envío gratis' },
                { type: 'caja_sorpresa', label: 'Caja sorpresa', quantity: 1 },
            ],
        }])
    })

    it('prioriza una combinación sobre el envío gratuito por monto', () => {
        const quote = evaluateCheckoutPromotions([
            item('Luxury', 10, 3, 30),
        ], { isClubMember: true })

        expect(quote.appliedPromotions).toEqual([{
            key: 'luxury-club',
            name: 'Pack Luxury Club',
            benefits: [
                { type: 'envio_gratis', label: 'Envío gratis' },
                { type: 'caja_sorpresa', label: 'Caja sorpresa', quantity: 1 },
            ],
        }])
    })

    it('solo considera el valor cuya etiqueta es Saquitos', () => {
        const quote = evaluateCheckoutPromotions([{
            line_name: 'Luxury',
            presentation: [{ label: 'Peso', value: 10 }, { label: 'Saquitos', value: 50 }],
            quantity: 3,
            unit_price: 1,
        }])
        expect(quote.matchedPromotions).toHaveLength(0)
        expect(quote.deliveryCost).toBe(10)
    })

    it('el servidor de Astro reemplaza montos y promociones enviados por el navegador', () => {
        const order = buildAuthoritativeCheckout({
            delivery_type: 'envio',
            delivery_cost: 0,
            amount: 0,
            promotions: [{ key: 'inventada' }],
            delivery_date: '2026-08-23',
            partner_order_lines: [{ article_id: 'product-1', quantity: 1, unit_price: 0 }],
        }, [{
            id: 'product-1',
            name: 'Producto tradicional',
            price: 20,
            list_price: 20,
            line: { name: 'Tradicional' },
            ecommerce_data: {
                price: 20,
                presentation: [{ label: 'Saquitos', value: 20 }],
            },
        }], {
            isClubMember: false,
            ubigeo: { provincia: 'LIMA' },
            now: new Date('2026-08-22T19:00:00.000Z'),
        })

        expect(order.delivery_cost).toBe(10)
        expect(order.amount).toBe(30)
        expect(order.promotions).toEqual([])
        expect(order.partner_order_lines[0].unit_price).toBe(20)
        expect(order.delivery_address_data.ubigeo1.provincia).toBe('LIMA')
    })

    it('el servidor de Astro valida Lima con el ubigeo obtenido del ERP', () => {
        expect(() => buildAuthoritativeCheckout({
            delivery_type: 'envio',
            delivery_date: '2026-08-23',
            partner_order_lines: [{ article_id: 'product-1', quantity: 1 }],
        }, [{
            id: 'product-1',
            name: 'Producto',
            price: 20,
            ecommerce_data: { price: 20, presentation: [] },
        }], {
            isClubMember: false,
            ubigeo: { provincia: 'CALLAO' },
            now: new Date('2026-08-22T19:00:00.000Z'),
        })).toThrow('DELIVERY_OUTSIDE_LIMA')
    })

    it('el servidor de Astro rechaza una fecha anterior a la permitida', () => {
        expect(() => buildAuthoritativeCheckout({
            delivery_type: 'retiro',
            punto_retiro: 'oficina-ekobusiness',
            delivery_date: '2026-08-29',
            partner_order_lines: [{ article_id: 'product-1', quantity: 1 }],
        }, [{
            id: 'product-1',
            name: 'Producto',
            price: 20,
            ecommerce_data: { price: 20, presentation: [] },
        }], {
            isClubMember: false,
            now: new Date('2026-08-28T21:00:00.000Z'),
        })).toThrow('INVALID_DELIVERY_DATE')
    })

    it('el servidor guarda el punto de retiro oficial y descarta una dirección manipulada', () => {
        const order = buildAuthoritativeCheckout({
            delivery_type: 'retiro',
            punto_retiro: 'planta-sunka',
            delivery_address: 'Dirección inventada',
            delivery_address_data: {
                punto_retiro: { nombre: 'Local inventado' },
                horario: 'Todo el día',
            },
            delivery_date: '2026-08-30',
            partner_order_lines: [{ article_id: 'product-1', quantity: 1 }],
        }, [{
            id: 'product-1',
            name: 'Producto',
            price: 20,
            ecommerce_data: { price: 20, presentation: [] },
        }], {
            isClubMember: false,
            now: new Date('2026-08-28T19:00:00.000Z'),
        })

        expect(order.delivery_address).toBe(
            'Cal. 7 Mza. D Lote 10 Urb. Los Productores, Santa Anita',
        )
        expect(order.delivery_address_data).toEqual({
            punto_retiro: {
                id: 'planta-sunka',
                nombre: 'Planta Sunka',
                direccion: 'Cal. 7 Mza. D Lote 10 Urb. Los Productores, Santa Anita',
            },
            horario: '8:00 a. m. a 4:00 p. m.',
        })
    })

    it('el servidor rechaza puntos de retiro que no pertenecen al catálogo', () => {
        expect(() => buildAuthoritativeCheckout({
            delivery_type: 'retiro',
            punto_retiro: 'local-inventado',
            delivery_date: '2026-08-30',
            partner_order_lines: [{ article_id: 'product-1', quantity: 1 }],
        }, [{
            id: 'product-1',
            name: 'Producto',
            price: 20,
            ecommerce_data: { price: 20, presentation: [] },
        }], {
            isClubMember: false,
            now: new Date('2026-08-28T19:00:00.000Z'),
        })).toThrow('INVALID_PICKUP_LOCATION')
    })
})
