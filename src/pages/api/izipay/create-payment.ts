import type { APIRoute } from 'astro'
import { createPaymentSchema } from '@/lib/api-schemas'
import { requestWithOptionalSession } from '@/lib/server/backend'
import { assertSameOrigin, forbiddenOrigin, invalidRequest, json, parseJson } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, createPaymentSchema)
    if (!parsed.success) return invalidRequest()
    const result = await requestWithOptionalSession(context, 'payments/izipay/form-token', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
    })
    return json(result)
}
