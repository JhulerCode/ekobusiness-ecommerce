import type { APIRoute } from 'astro'
import { newsletterSchema } from '@/lib/api-schemas'
import { invalidRequest, parseJson, proxyJson } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    const parsed = await parseJson(context.request, newsletterSchema)
    if (!parsed.success) return invalidRequest()
    return proxyJson(context, 'forms/newsletter', { body: parsed.data })
}
