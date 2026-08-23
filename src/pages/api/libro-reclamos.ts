import type { APIRoute } from 'astro'
import { complaintSchema } from '@/lib/api-schemas'
import { invalidRequest, parseJson, proxyJson } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    const parsed = await parseJson(context.request, complaintSchema)
    if (!parsed.success) return invalidRequest()
    return proxyJson(context, 'forms/claims', { body: parsed.data })
}
