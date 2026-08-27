import { describe, expect, it } from 'vitest'
import { evaluateCheckoutPromotions } from '../../src/lib/checkout-promotions'
import { buildAuthoritativeCheckout } from '../../src/lib/server/checkout-quote'

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

    it('registra el motivo del envío gratuito por monto', () => {
        const quote = evaluateCheckoutPromotions([item('Tradicional', 20, 1, 75)])
        expect(quote.appliedPromotions).toEqual([{
            key: 'free-shipping-general',
            name: 'Envío gratis desde S/ 75',
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
            socio_pedido_items: [{ articulo: 'product-1', cantidad: 1 }],
        }, [{
            id: 'product-1',
            nombre: 'Producto',
            precio: 20,
            ecommerce_data: { precio: 20, presentacion: [] },
        }], {
            isClubMember: false,
            ubigeo: { provincia: 'CALLAO' },
        })).toThrow('DELIVERY_OUTSIDE_LIMA')
    })
})
