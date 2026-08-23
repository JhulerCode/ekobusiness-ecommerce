import type { APIRoute } from 'astro'
import { orderResendSchema } from '@/lib/api-schemas'
import { invalidRequest, parseJson, proxyJson } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    const parsed = await parseJson(context.request, orderResendSchema)
    if (!parsed.success) return invalidRequest()
    return proxyJson(context, 'orders/lookup/resend', { body: parsed.data })
}
