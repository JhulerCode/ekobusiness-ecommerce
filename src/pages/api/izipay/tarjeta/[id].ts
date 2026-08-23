import type { APIRoute } from 'astro'
import { idSchema } from '@/lib/api-schemas'
import { invalidRequest, proxyJson } from '@/lib/server/bff'

export const DELETE: APIRoute = async (context) => {
    const id = idSchema.safeParse(context.params.id)
    if (!id.success) return invalidRequest()
    return proxyJson(context, `payments/izipay/payment-methods/${encodeURIComponent(id.data)}`, {
        auth: true,
        method: 'DELETE',
        body: {},
    })
}
