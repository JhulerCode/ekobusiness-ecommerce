import type { APIRoute } from 'astro'
import { backendRequest } from '@/lib/server/backend'
import { json } from '@/lib/server/bff'
import { integrationPublicPath } from '@/lib/server/public-api'

export const GET: APIRoute = async ({ request }) => {
    const query = new URL(request.url).searchParams.get('qry')
    let qry: unknown
    try { qry = query ? JSON.parse(query) : undefined } catch { qry = undefined }
    const result = await backendRequest(integrationPublicPath('ubigeos', qry))
    const response = json(result)
    response.headers.set('cache-control', 'public, s-maxage=60, stale-while-revalidate=300')
    return response
}
