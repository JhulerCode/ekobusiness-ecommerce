import type { APIRoute } from 'astro'
import { idSchema, jsonObjectSchema } from '@/lib/api-schemas'
import { clearSessionCookies } from '@/lib/server/backend'
import { invalidRequest, parseJson, proxyJson } from '@/lib/server/bff'

export const PATCH: APIRoute = async (context) => {
    const id = idSchema.safeParse(context.params.id)
    const body = await parseJson(context.request, jsonObjectSchema)
    if (!id.success || !body.success) return invalidRequest()
    return proxyJson(context, 'customers/me', {
        auth: true,
        method: 'PATCH',
        body: body.data,
    })
}

export const DELETE: APIRoute = async (context) => {
    const id = idSchema.safeParse(context.params.id)
    if (!id.success) return invalidRequest()
    const response = await proxyJson(context, 'customers/me', {
        auth: true,
        method: 'DELETE',
        body: {},
    })
    if (response.ok) clearSessionCookies(context)
    return response
}
