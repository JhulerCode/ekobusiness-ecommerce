import type { APIRoute } from 'astro'
import {
    REFRESH_COOKIE,
    backendRequest,
    clearSessionCookies,
    getClientIp,
    setAccessCookie,
} from '@/lib/server/backend'
import { assertSameOrigin, failure, forbiddenOrigin, json } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const refreshToken = context.cookies.get(REFRESH_COOKIE)?.value
    if (!refreshToken) {
        return json(failure(401, 'session-expired', 'Sesión vencida', 'La sesión ha vencido.'))
    }
    const result = await backendRequest<{ access_token?: string }>('customers/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
        clientIp: getClientIp(context.request),
    })
    const token = result.ok ? result.data?.access_token : undefined
    if (token) {
        setAccessCookie(context, token)
    } else {
        clearSessionCookies(context)
    }
    if (!result.ok) return json(result)
    if (!token) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }
    return json({ ...result, data: {} })
}
