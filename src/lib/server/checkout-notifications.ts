import type { APIContext } from 'astro'
import { requestWithOptionalSession } from './backend'
import { renderOrderConfirmation, type MailOrder } from '@/lib/mail/order'
import { sendMail } from './mail'

type ClaimData = {
    order?: MailOrder
    lookup_code?: string
    access_token?: string
    email?: string | null
}

export async function sendCheckoutConfirmation(
    context: APIContext,
    { id, checkoutToken }: { id: string; checkoutToken: string },
) {
    const path = `payments/checkout/intents/${encodeURIComponent(id)}/confirmation`
    const claim = await requestWithOptionalSession<ClaimData>(context, `${path}/claim`, {
        method: 'POST',
        checkoutToken,
    })
    if (!claim.ok) {
        if (claim.status !== 204) {
            console.error(`[confirmation] claim -> ${claim.status} ${claim.problem.type}`)
        }
        return
    }

    const data = claim.data
    const to = data?.email || data?.order?.partner_data?.email
    if (!data?.order || !data.lookup_code || !data.access_token || !to) return

    let sent = false
    try {
        await sendMail({
            to,
            ...renderOrderConfirmation({
                order: data.order,
                lookupCode: data.lookup_code,
                accessToken: data.access_token,
                baseUrl: new URL(context.request.url).origin,
            }),
        })
        sent = true
    } catch (error) {
        console.error('[confirmation] no se pudo enviar el correo:', error)
    }

    const complete = await requestWithOptionalSession(context, `${path}/complete`, {
        method: 'POST',
        body: JSON.stringify({ sent }),
        checkoutToken,
    })
    if (!complete.ok) {
        console.error(`[confirmation] complete -> ${complete.status} ${complete.problem.type}`)
    }
}
