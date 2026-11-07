import type { APIRoute } from 'astro'
import { idSchema } from '@/lib/api-schemas'
import { backendRequest, setOrderCookie } from '@/lib/server/backend'

export const GET: APIRoute = async (context) => {
    const url = new URL(context.request.url)
    const id = idSchema.safeParse(url.searchParams.get('id'))
    const token = url.searchParams.get('token')
    if (!id.success || !token) return context.redirect('/consulta-pedido', 303)

    const result = await backendRequest(`orders/${encodeURIComponent(id.data)}`, { orderToken: token })
    if (!result.ok) return context.redirect('/consulta-pedido', 303)

    setOrderCookie(context, id.data, token, 7 * 24 * 60 * 60)
    return context.redirect(`/pedidos/${encodeURIComponent(id.data)}`, 303)
}
