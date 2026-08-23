import type { APIContext } from 'astro'
import type { z } from 'zod'
import type { ApiProblem, ApiResult } from '@/types/api'
import { backendRequest, getClientIp, requestWithSession, type BackendResult } from './backend'

const forwardedHeaders = ['retry-after', 'ratelimit-limit', 'ratelimit-remaining', 'ratelimit-reset']

function localProblem(status: number, slug: string, title: string, detail: string): ApiProblem {
    return { type: `urn:itd:ecommerce:problem:${slug}`, title, status, detail }
}

export function json<T>(result: BackendResult<T> | ApiResult<T>, status?: number) {
    const responseStatus = status ?? result.status
    const headers = new Headers()
    if ('headers' in result) {
        for (const name of forwardedHeaders) {
            const value = result.headers.get(name)
            if (value) headers.set(name, value)
        }
    }
    if (responseStatus === 204 && result.ok) return new Response(null, { status: 204, headers })
    if (!result.ok) {
        headers.set('content-type', 'application/problem+json; charset=utf-8')
        return new Response(JSON.stringify(result.problem), { status: responseStatus, headers })
    }
    headers.set('content-type', 'application/json; charset=utf-8')
    const body = {
        data: result.data,
        ...(result.meta ? { meta: result.meta } : {}),
        ...(result.warnings ? { warnings: result.warnings } : {}),
    }
    return new Response(JSON.stringify(body), { status: responseStatus, headers })
}

export function failure(status: number, slug: string, title: string, detail: string): ApiResult<never> {
    return { ok: false, status, problem: localProblem(status, slug, title, detail) }
}

export function assertSameOrigin(request: Request) {
    const origin = request.headers.get('origin')
    if (!origin) return true
    return origin === new URL(request.url).origin
}

export async function parseJson<T extends z.ZodType>(request: Request, schema: T) {
    try {
        return schema.safeParse(await request.json())
    } catch {
        return schema.safeParse(undefined)
    }
}

export function invalidRequest() {
    return json(failure(400, 'invalid-request', 'Solicitud no válida', 'Los datos enviados no son válidos.'))
}

export function forbiddenOrigin() {
    return json(failure(403, 'origin-forbidden', 'Origen no permitido', 'Origen de solicitud no permitido.'))
}

export async function proxyJson(
    context: APIContext,
    upstreamPath: string,
    options: { auth?: boolean; body?: unknown; method?: string } = {},
) {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const requestOptions = {
        method: options.method || context.request.method,
        body: options.body === undefined ? null : JSON.stringify(options.body),
        clientIp: getClientIp(context.request),
    }
    const result = options.auth
        ? await requestWithSession(context, upstreamPath, requestOptions)
        : await backendRequest(upstreamPath, requestOptions)
    return json(result)
}
