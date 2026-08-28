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
        linea_nombre: line,
        presentacion: [{ label: 'Saquitos', value: presentation }],
        cantidad: quantity,
        pu: price,
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
            linea_nombre: 'Luxury',
            presentacion: [{ label: 'Peso', value: 10 }, { label: 'Saquitos', value: 50 }],
            cantidad: 3,
            pu: 1,
        }])
        expect(quote.matchedPromotions).toHaveLength(0)
        expect(quote.deliveryCost).toBe(10)
    })

    it('el servidor de Astro reemplaza montos y promociones enviados por el navegador', () => {
        const order = buildAuthoritativeCheckout({
            entrega_tipo: 'envio',
            entrega_costo: 0,
            monto: 0,
            promociones: [{ key: 'inventada' }],
            fecha_entrega: '2026-08-23',
            socio_pedido_items: [{ articulo: 'product-1', cantidad: 1, pu: 0 }],
        }, [{
            id: 'product-1',
            nombre: 'Producto tradicional',
            precio: 20,
            list_price: 20,
            linea1: { nombre: 'Tradicional' },
            ecommerce_data: {
                precio: 20,
                presentacion: [{ label: 'Saquitos', value: 20 }],
            },
        }], {
            isClubMember: false,
            ubigeo: { provincia: 'LIMA' },
            now: new Date('2026-08-22T19:00:00.000Z'),
        })

        expect(order.entrega_costo).toBe(10)
        expect(order.monto).toBe(30)
        expect(order.promociones).toEqual([])
        expect(order.socio_pedido_items[0].pu).toBe(20)
        expect(order.entrega_direccion_datos.ubigeo1.provincia).toBe('LIMA')
    })

    it('el servidor de Astro valida Lima con el ubigeo obtenido del ERP', () => {
        expect(() => buildAuthoritativeCheckout({
            entrega_tipo: 'envio',
            fecha_entrega: '2026-08-23',
            socio_pedido_items: [{ articulo: 'product-1', cantidad: 1 }],
        }, [{
            id: 'product-1',
            nombre: 'Producto',
            precio: 20,
            ecommerce_data: { precio: 20, presentacion: [] },
        }], {
            isClubMember: false,
            ubigeo: { provincia: 'CALLAO' },
            now: new Date('2026-08-22T19:00:00.000Z'),
        })).toThrow('DELIVERY_OUTSIDE_LIMA')
    })

    it('el servidor de Astro rechaza una fecha anterior a la permitida', () => {
        expect(() => buildAuthoritativeCheckout({
            entrega_tipo: 'retiro',
            punto_retiro: 'oficina-ekobusiness',
            fecha_entrega: '2026-08-29',
            socio_pedido_items: [{ articulo: 'product-1', cantidad: 1 }],
        }, [{
            id: 'product-1',
            nombre: 'Producto',
            precio: 20,
            ecommerce_data: { precio: 20, presentacion: [] },
        }], {
            isClubMember: false,
            now: new Date('2026-08-28T21:00:00.000Z'),
        })).toThrow('INVALID_DELIVERY_DATE')
    })

    it('el servidor guarda el punto de retiro oficial y descarta una dirección manipulada', () => {
        const order = buildAuthoritativeCheckout({
            entrega_tipo: 'retiro',
            punto_retiro: 'planta-sunka',
            direccion_entrega: 'Dirección inventada',
            entrega_direccion_datos: {
                punto_retiro: { nombre: 'Local inventado' },
                horario: 'Todo el día',
            },
            fecha_entrega: '2026-08-30',
            socio_pedido_items: [{ articulo: 'product-1', cantidad: 1 }],
        }, [{
            id: 'product-1',
            nombre: 'Producto',
            precio: 20,
            ecommerce_data: { precio: 20, presentacion: [] },
        }], {
            isClubMember: false,
            now: new Date('2026-08-28T19:00:00.000Z'),
        })

        expect(order.direccion_entrega).toBe(
            'Cal. 7 Mza. D Lote 10 Urb. Los Productores, Santa Anita',
        )
        expect(order.entrega_direccion_datos).toEqual({
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
            entrega_tipo: 'retiro',
            punto_retiro: 'local-inventado',
            fecha_entrega: '2026-08-30',
            socio_pedido_items: [{ articulo: 'product-1', cantidad: 1 }],
        }, [{
            id: 'product-1',
            nombre: 'Producto',
            precio: 20,
            ecommerce_data: { precio: 20, presentacion: [] },
        }], {
            isClubMember: false,
            now: new Date('2026-08-28T19:00:00.000Z'),
        })).toThrow('INVALID_PICKUP_LOCATION')
    })
})
