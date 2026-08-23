import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { formatProductos } from '@/lib/api'
import { orderLookupSchema, signInSchema } from '@/lib/api-schemas'
import { assertSameOrigin, failure, json } from '@/lib/server/bff'
import { orderCookieName } from '@/lib/server/backend'
import { integrationPublicPath } from '@/lib/server/public-api'

describe('contratos del ecommerce', () => {
    it('normaliza productos del ERP', () => {
        const [product] = formatProductos([
            {
                id: 'tea-1',
                nombre: 'Nombre interno',
                precio: 12,
                ecommerce_data: {
                    name: 'Té Andino',
                    fotos: [{ url: 'https://cdn.example/tea.webp' }],
                },
            },
        ])

        expect(product).toMatchObject({
            nombre: 'Té Andino',
            precio: '12.00',
            foto: 'https://cdn.example/tea.webp',
            slug: 'tea-1',
        })
    })

    it('rechaza credenciales y códigos de consulta inválidos', () => {
        expect(signInSchema.safeParse({ correo: 'invalido', contrasena: '' }).success).toBe(false)
        expect(orderLookupSchema.safeParse({ codigo: 'P-1', codigo_consulta: '123' }).success).toBe(
            false,
        )
    })

    it('acepta únicamente el mismo origen en solicitudes mutables', () => {
        expect(
            assertSameOrigin(
                new Request('https://sunka.pe/api/newsletter', {
                    headers: { origin: 'https://sunka.pe' },
                }),
            ),
        ).toBe(true)
        expect(
            assertSameOrigin(
                new Request('https://sunka.pe/api/newsletter', {
                    headers: { origin: 'https://attacker.example' },
                }),
            ),
        ).toBe(false)
    })

    it('sanea el identificador usado en cookies de pedidos', () => {
        expect(orderCookieName('order/../../1')).toBe('sunka_order_order1')
    })

    it('traduce qry heredado a parámetros fijos de integración', () => {
        const path = integrationPublicPath('productos', {
            fltr: { id: { op: 'Es', val: ['tea-1', 'tea-2'] }, linea: { op: 'Es', val: 'ande' } },
            cols: ['secret-column'],
        })
        expect(path).toBe('catalog/products?ids=tea-1%2Ctea-2&linea=ande')
        expect(path).not.toContain('secret-column')
    })

    it('traduce la búsqueda parcial de distritos sin exponer operadores arbitrarios', () => {
        const path = integrationPublicPath('ubigeos', {
            fltr: { distrito: { op: 'Contiene', val: 'santa' } },
        })

        expect(path).toBe('locations/ubigeos?search=santa')
        expect(path).not.toContain('Contiene')
    })

    it('serializa errores BFF como Problem Details y soporta 204', async () => {
        const problemResponse = json(
            failure(400, 'invalid-request', 'Solicitud no válida', 'Datos incorrectos.'),
        )
        expect(problemResponse.status).toBe(400)
        expect(problemResponse.headers.get('content-type')).toContain('application/problem+json')
        expect(await problemResponse.json()).toMatchObject({
            type: 'urn:itd:ecommerce:problem:invalid-request',
            status: 400,
            detail: 'Datos incorrectos.',
        })

        const emptyResponse = json({ ok: true, status: 204 })
        expect(emptyResponse.status).toBe(204)
        expect(await emptyResponse.text()).toBe('')
    })

    it('no conserva consumidores del contrato legacy en src', () => {
        const sourceDir = fileURLToPath(new URL('../../src', import.meta.url))
        const filesBelow = (directory: string): string[] => readdirSync(directory, { withFileTypes: true })
            .flatMap((entry) => {
                const path = `${directory}/${entry.name}`
                return entry.isDirectory() ? filesBelow(path) : [path]
            })
        const sourceFiles = filesBelow(sourceDir).filter((path) => /\.(ts|vue|astro)$/.test(path))

        for (const path of sourceFiles) {
            const source = readFileSync(path, 'utf8')
            expect(source, path).not.toMatch(/\.code\b|\bcode\s*:/)
        }
    })
})
