import type { APIRoute } from 'astro'
import { accountPasswordSchema } from '@/lib/api-schemas'
import { invalidRequest, parseJson, proxyJson } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    const parsed = await parseJson(context.request, accountPasswordSchema)
    if (!parsed.success) return invalidRequest()
    return proxyJson(context, 'customers/me/password', { auth: true, body: parsed.data })
}
