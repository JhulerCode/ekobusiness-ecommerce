import type { APIRoute } from 'astro'
import { orderCreateSchema } from '@/lib/api-schemas'
import { requestWithOptionalSession, requestWithSession, setOrderCookie } from '@/lib/server/backend'
import { assertSameOrigin, failure, forbiddenOrigin, invalidRequest, json, parseJson } from '@/lib/server/bff'
import { prepareCheckoutOrder } from '@/lib/server/checkout-quote'

export const GET: APIRoute = async (context) => json(await requestWithSession(context, 'orders'))

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, orderCreateSchema)
    if (!parsed.success) return invalidRequest()
    const prepared = await prepareCheckoutOrder(context, parsed.data)
    if (!prepared.ok) return json(prepared)
    const result = await requestWithOptionalSession<{
        id?: string
        access_token?: string
        redirect_url?: string
    }>(context, 'orders', {
        method: 'POST',
        body: JSON.stringify(prepared.data),
    })
    if (!result.ok) return json(result)
    const data = result.data
    if (!data?.id || !data.access_token) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }
    setOrderCookie(context, data.id, data.access_token, 60 * 60)
    const { access_token: _accessToken, ...publicData } = data
    return json({ ...result, data: { ...publicData, redirect_url: `/pedidos/${data.id}` } })
}
