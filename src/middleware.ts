import { defineMiddleware } from 'astro:middleware'
import { resolveSession } from '@/lib/server/backend'

export const onRequest = defineMiddleware(async (context, next) => {
    const acceptsHtml = context.request.headers.get('accept')?.includes('text/html')

    if (context.request.method === 'GET' && acceptsHtml && !context.url.pathname.startsWith('/api/')) {
        context.locals.session = await resolveSession(context)
    }

    return next()
})
