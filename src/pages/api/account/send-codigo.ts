import type { APIRoute } from 'astro'
import { accountCodeSchema } from '@/lib/api-schemas'
import { invalidRequest, parseJson, proxyJson } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    const parsed = await parseJson(context.request, accountCodeSchema)
    if (!parsed.success) return invalidRequest()
    return proxyJson(context, 'customers/me/verification-code', { auth: true, body: parsed.data })
}
