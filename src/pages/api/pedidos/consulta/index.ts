import type { APIRoute } from 'astro'
import { orderLookupSchema } from '@/lib/api-schemas'
import { backendRequest, getClientIp, setOrderCookie } from '@/lib/server/backend'
import { assertSameOrigin, failure, forbiddenOrigin, invalidRequest, json, parseJson } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const parsed = await parseJson(context.request, orderLookupSchema)
    if (!parsed.success) return invalidRequest()
    const result = await backendRequest<{ id?: string; access_token?: string; redirect_url?: string }>('orders/lookup', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
        clientIp: getClientIp(context.request),
    })
    if (!result.ok) return json(result)
    const data = result.data
    if (!data?.id || !data.access_token) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }
    setOrderCookie(context, data.id, data.access_token)
    const { access_token: _accessToken, ...publicData } = data
    return json({ ...result, data: { ...publicData, redirect_url: `/pedidos/${data.id}` } })
}
