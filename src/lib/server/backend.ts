import type { APIContext } from 'astro'
import type { ApiMeta, ApiProblem, ApiResult, ApiWarning } from '@/types/api'

export const ACCESS_COOKIE = 'sunka_access'
export const REFRESH_COOKIE = 'sunka_refresh'

interface BackendRequestOptions {
    method?: string
    body?: BodyInit | null
    token?: string
    orderToken?: string
    checkoutToken?: string
    clientIp?: string
    headers?: HeadersInit
}

export type BackendResult<T = unknown> = ApiResult<T> & { headers: Headers }

const cookieOptions = (maxAge: number) => ({
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'lax' as const,
    secure: import.meta.env.PROD,
})

function backendUrl(path: string) {
    const base = (import.meta.env.API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '')).replace(
        /\/$/,
        '',
    )
    if (!base) throw new Error('API_URL no está configurada')
    return `${base}/api/integration/v1/${path.replace(/^\//, '')}`
}

function genericProblem(status: number, type: string, title: string, detail: string): ApiProblem {
    return { type: `urn:itd:ecommerce:problem:${type}`, title, status, detail }
}

function safeProblem(value: unknown, status: number): ApiProblem {
    const source = value && typeof value === 'object' ? value as Record<string, unknown> : {}
    if (status >= 500) {
        return genericProblem(status, 'service-unavailable', 'Servicio no disponible', 'El servicio no está disponible temporalmente.')
    }
    if (
        typeof source.type === 'string' &&
        typeof source.title === 'string' &&
        typeof source.detail === 'string'
    ) {
        return {
            type: source.type,
            title: source.title,
            status,
            detail: source.detail,
            ...(typeof source.instance === 'string' ? { instance: source.instance } : {}),
            ...(Array.isArray(source.errors) ? { errors: source.errors as ApiProblem['errors'] } : {}),
        }
    }
    return genericProblem(status, 'upstream-error', 'Solicitud no completada', 'No se pudo completar la solicitud.')
}

function validWarnings(value: unknown): ApiWarning[] | undefined {
    if (!Array.isArray(value)) return undefined
    const warnings = value.filter((item): item is ApiWarning => Boolean(
        item && typeof item === 'object' &&
        typeof item.type === 'string' && typeof item.title === 'string' &&
        (item.detail === undefined || typeof item.detail === 'string'),
    ))
    return warnings.length ? warnings : undefined
}

export async function backendRequest<T = unknown>(
    path: string,
    options: BackendRequestOptions = {},
): Promise<BackendResult<T>> {
    const headers = new Headers(options.headers)
    headers.set('accept', 'application/json, application/problem+json')
    headers.set('x-api-key', import.meta.env.ERP_API_KEY || '')
    if (options.clientIp) headers.set('x-client-ip', options.clientIp)
    if (options.token) headers.set('authorization', `Bearer ${options.token}`)
    if (options.orderToken) headers.set('x-order-access', options.orderToken)
    if (options.checkoutToken) headers.set('x-checkout-access', options.checkoutToken)
    if (options.body && !(options.body instanceof FormData) && !headers.has('content-type')) {
        headers.set('content-type', 'application/json')
    }

    try {
        const response = await fetch(backendUrl(path), {
            method: options.method || 'GET',
            headers,
            body: options.body,
        })
        const responseHeaders = response.headers
        if (response.status === 204) {
            return response.ok
                ? { ok: true, status: 204, headers: responseHeaders }
                : { ok: false, status: 204, problem: safeProblem(null, 204), headers: responseHeaders }
        }

        const raw = await response.text()
        let parsed: unknown
        try {
            parsed = raw ? JSON.parse(raw) : null
        } catch {
            parsed = null
        }

        if (!response.ok) {
            return {
                ok: false,
                status: response.status,
                problem: safeProblem(parsed, response.status),
                headers: responseHeaders,
            }
        }

        if (!parsed || typeof parsed !== 'object' || !('data' in parsed)) {
            return {
                ok: false,
                status: 502,
                problem: genericProblem(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'),
                headers: responseHeaders,
            }
        }
        const source = parsed as Record<string, unknown>
        return {
            ok: true,
            status: response.status,
            data: source.data as T,
            ...(source.meta && typeof source.meta === 'object' ? { meta: source.meta as ApiMeta } : {}),
            ...(validWarnings(source.warnings) ? { warnings: validWarnings(source.warnings) } : {}),
            headers: responseHeaders,
        }
    } catch {
        return {
            ok: false,
            status: 503,
            problem: genericProblem(503, 'network-unavailable', 'Servicio no disponible', 'No se pudo conectar con el servicio.'),
            headers: new Headers(),
        }
    }
}

export function getClientIp(request: Request) {
    return (request.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || undefined
}

export function setAccessCookie(context: APIContext, token: string) {
    context.cookies.set(ACCESS_COOKIE, token, cookieOptions(15 * 60))
}

export function setRefreshCookie(context: APIContext, token: string) {
    context.cookies.set(REFRESH_COOKIE, token, cookieOptions(30 * 24 * 60 * 60))
}

export function clearSessionCookies(context: APIContext) {
    context.cookies.delete(ACCESS_COOKIE, { path: '/' })
    context.cookies.delete(REFRESH_COOKIE, { path: '/' })
}

function sessionProblem(detail: string): BackendResult<never> {
    return {
        ok: false,
        status: 401,
        problem: genericProblem(401, 'session-expired', 'Sesión vencida', detail),
        headers: new Headers(),
    }
}

export async function requestWithSession<T = unknown>(
    context: APIContext,
    path: string,
    options: Omit<BackendRequestOptions, 'token'> = {},
): Promise<BackendResult<T>> {
    const accessToken = context.cookies.get(ACCESS_COOKIE)?.value
    if (!accessToken) return sessionProblem('Inicia sesión para continuar.')

    const requestOptions = {
        ...options,
        clientIp: options.clientIp || getClientIp(context.request),
        token: accessToken,
    }
    let result = await backendRequest<T>(path, requestOptions)
    const isCustomerSessionFailure = !result.ok && result.status === 401 && [
        'urn:itd:integration:problem:middleware:invalid-customer-session',
        'urn:itd:integration:problem:customers:invalid-session',
    ].includes(result.problem.type)
    if (!isCustomerSessionFailure) return result

    const refreshToken = context.cookies.get(REFRESH_COOKIE)?.value
    if (!refreshToken) {
        clearSessionCookies(context)
        return result
    }

    const refreshed = await backendRequest<{ access_token?: string }>('customers/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
        clientIp: requestOptions.clientIp,
    })
    const nextToken = refreshed.ok ? refreshed.data?.access_token : undefined
    if (!nextToken) {
        clearSessionCookies(context)
        return sessionProblem('La sesión ha vencido.')
    }

    setAccessCookie(context, nextToken)
    result = await backendRequest<T>(path, { ...requestOptions, token: nextToken })
    if (result.status === 401) clearSessionCookies(context)
    return result
}

export async function requestWithOptionalSession<T = unknown>(
    context: APIContext,
    path: string,
    options: Omit<BackendRequestOptions, 'token'> = {},
) {
    if (!context.cookies.has(ACCESS_COOKIE)) {
        return backendRequest<T>(path, {
            ...options,
            clientIp: options.clientIp || getClientIp(context.request),
        })
    }
    return requestWithSession<T>(context, path, options)
}

export function orderCookieName(id: string) {
    return `sunka_order_${id.replace(/[^a-zA-Z0-9_-]/g, '')}`
}

export function setOrderCookie(context: APIContext, id: string, token: string, maxAge = 15 * 60) {
    context.cookies.set(orderCookieName(id), token, {
        ...cookieOptions(maxAge),
        path: `/pedidos/${encodeURIComponent(id)}`,
    })
}

export function checkoutCookieName(id: string) {
    return `sunka_checkout_${id.replace(/[^a-zA-Z0-9_-]/g, '')}`
}

export function setCheckoutCookie(context: APIContext, id: string, token: string) {
    context.cookies.set(checkoutCookieName(id), token, {
        ...cookieOptions(24 * 60 * 60),
        path: '/api/izipay',
    })
}

export function getCheckoutCookie(context: APIContext, id: string) {
    return context.cookies.get(checkoutCookieName(id))?.value
}

export function clearCheckoutCookie(context: APIContext, id: string) {
    context.cookies.delete(checkoutCookieName(id), { path: '/api/izipay' })
}
