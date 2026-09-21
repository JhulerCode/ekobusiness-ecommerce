import type { APIRoute } from 'astro'
import { backendRequest } from '@/lib/server/backend'
import { json } from '@/lib/server/bff'
import { integrationPublicPath } from '@/lib/server/public-api'

export const GET: APIRoute = async ({ request }) => {
    const source = new URL(request.url).searchParams
    const result = await backendRequest(integrationPublicPath('sistema', {
        keys: source.get('keys') ?? undefined,
    }))
    const response = json(result)
    response.headers.set('cache-control', 'public, s-maxage=60, stale-while-revalidate=300')
    return response
}
