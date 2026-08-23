import type { APIRoute } from 'astro'
import { signInSchema } from '@/lib/api-schemas'
import {
    backendRequest,
    getClientIp,
    setAccessCookie,
    setRefreshCookie,
} from '@/lib/server/backend'
import { assertSameOrigin, failure, forbiddenOrigin, invalidRequest, json, parseJson } from '@/lib/server/bff'

interface AuthPayload {
    user?: Record<string, unknown>
    access_token?: string
    refresh_token?: string
}

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, signInSchema)
    if (!parsed.success) return invalidRequest()
    const result = await backendRequest<AuthPayload>('customers/auth/signin', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
        clientIp: getClientIp(context.request),
    })
    if (!result.ok) return json(result)
    const { user, access_token: token, refresh_token: refreshToken } = result.data || {}
    if (!user || !token || !refreshToken) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }
    setAccessCookie(context, token)
    setRefreshCookie(context, refreshToken)
    return json({ ...result, data: user })
}
