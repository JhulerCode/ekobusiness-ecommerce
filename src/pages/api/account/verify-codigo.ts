import type { APIRoute } from 'astro'
import { accountVerifySchema } from '@/lib/api-schemas'
import { invalidRequest, parseJson, proxyJson } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    const parsed = await parseJson(context.request, accountVerifySchema)
    if (!parsed.success) return invalidRequest()
    return proxyJson(context, 'customers/me/verify-code', { auth: true, body: parsed.data })
}
