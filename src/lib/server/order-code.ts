import { randomInt } from 'node:crypto'

const orderCodeTimeZone = 'America/Lima'

type OrderCodeOptions = {
    now?: Date
    random?: () => number
}

function datePart(now: Date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: orderCodeTimeZone,
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(now)
    const value = (type: string) => parts.find((part) => part.type === type)?.value || ''
    return `${value('year')}${value('month')}${value('day')}`
}

export function generateOrderCode(
    { now = new Date(), random = () => randomInt(0, 1_000_000) }: OrderCodeOptions = {},
) {
    return `${datePart(now)}${String(random()).padStart(6, '0')}`
}
