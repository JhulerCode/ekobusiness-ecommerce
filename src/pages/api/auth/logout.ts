import type { APIRoute } from 'astro'
import { clearSessionCookies, requestWithSession } from '@/lib/server/backend'
import { assertSameOrigin, forbiddenOrigin, json } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const result = await requestWithSession(context, 'customers/auth/logout', { method: 'POST', body: '{}' })
    clearSessionCookies(context)
    return result.status === 401 ? new Response(null, { status: 204 }) : json(result)
}
