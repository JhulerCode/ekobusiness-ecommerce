import type { APIRoute } from 'astro'
import { backendRequest } from '@/lib/server/backend'
import { json } from '@/lib/server/bff'
import { integrationPublicPath } from '@/lib/server/public-api'

export const GET: APIRoute = async ({ request }) => {
    const source = new URL(request.url).searchParams
    const result = await backendRequest(integrationPublicPath('productos', {
        ids: source.get('ids') ?? undefined,
        linea: source.get('linea') ?? undefined,
        categoria: source.get('categoria') ?? undefined,
        featured: source.get('featured') ?? undefined,
    }))
    const response = json(result)
    response.headers.set('cache-control', 'public, s-maxage=60, stale-while-revalidate=300')
    return response
}
