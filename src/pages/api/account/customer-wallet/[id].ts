import type { APIRoute } from 'astro'
import { idSchema } from '@/lib/api-schemas'
import { requestWithSession } from '@/lib/server/backend'
import { invalidRequest, json } from '@/lib/server/bff'

export const GET: APIRoute = async (context) => {
    const id = idSchema.safeParse(context.params.id)
    if (!id.success) return invalidRequest()
    return json(await requestWithSession(context, 'customers/me/wallet'))
}
