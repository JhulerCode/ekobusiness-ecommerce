import type { APIRoute } from 'astro'
import { idSchema } from '@/lib/api-schemas'
import { requestWithSession, setOrderCookie } from '@/lib/server/backend'
import { assertSameOrigin, failure, forbiddenOrigin, invalidRequest, json } from '@/lib/server/bff'

export const POST: APIRoute = async (context) => {
    if (!assertSameOrigin(context.request)) return forbiddenOrigin()
    const id = idSchema.safeParse(context.params.id)
    if (!id.success) return invalidRequest()
    const result = await requestWithSession<{ id?: string; access_token?: string; redirect_url?: string }>(
        context,
        `orders/${encodeURIComponent(id.data)}/access`,
        { method: 'POST', body: '{}' },
    )
    if (!result.ok) return json(result)
    const data = result.data
    if (!data?.id || !data.access_token) {
        return json(failure(502, 'upstream-contract-error', 'Respuesta no válida', 'El servicio devolvió una respuesta no válida.'))
    }
    setOrderCookie(context, data.id, data.access_token)
    const { access_token: _accessToken, ...publicData } = data
    return json({ ...result, data: { ...publicData, redirect_url: `/pedidos/${data.id}?account=true` } })
}
