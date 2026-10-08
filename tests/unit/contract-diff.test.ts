import { describe, expect, it } from 'vitest'
import { diffContracts } from '../../scripts/check-integration-contract.mjs'

function spec(overrides: Record<string, any> = {}): any {
    return {
        info: { version: '1.1.0' },
        paths: {
            '/orders': {
                get: { responses: { 200: { content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderListEnvelope' } } } } } },
                post: {
                    requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderCreateRequest' } } } },
                    responses: { 201: { content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderCreatedEnvelope' } } } } },
                },
            },
        },
        components: {
            schemas: {
                OrderListEnvelope: { type: 'object' },
                OrderCreatedEnvelope: { type: 'object' },
                OrderCreateRequest: {
                    type: 'object',
                    required: ['partner_data'],
                    properties: {
                        type: { const: 'sale' },
                        payment_method: { type: 'string', enum: ['tarjeta', 'yape'] },
                        partner_data: { type: 'object' },
                    },
                },
            },
        },
        ...overrides,
    }
}

describe('diff del contrato de integration', () => {
    it('no reporta nada sin cambios', () => {
        expect(diffContracts(spec(), spec())).toEqual([])
    })

    it('detecta operación eliminada y enum reducido', () => {
        const next = spec()
        delete next.paths['/orders'].post
        next.components.schemas.OrderCreateRequest.properties.payment_method.enum = ['tarjeta']
        const findings = diffContracts(spec(), next)
        expect(findings.some((finding) => finding.includes('POST /orders'))).toBe(true)
        expect(findings.some((finding) => finding.includes('enum pierde'))).toBe(true)
    })

    it('detecta const cambiado y propiedad eliminada', () => {
        const next = spec()
        next.components.schemas.OrderCreateRequest.properties.type.const = 'purchase'
        delete next.components.schemas.OrderCreateRequest.properties.partner_data
        const findings = diffContracts(spec(), next)
        expect(findings.some((finding) => finding.includes('const'))).toBe(true)
        expect(findings.some((finding) => finding.includes('propiedad eliminada'))).toBe(true)
    })

    it('ignora campos añadidos no requeridos', () => {
        const next = spec()
        next.components.schemas.OrderCreateRequest.properties.observation = { type: 'string' }
        expect(diffContracts(spec(), next)).toEqual([])
    })
})
