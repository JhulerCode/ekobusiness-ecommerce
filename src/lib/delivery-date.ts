const LIMA_TIME_ZONE = 'America/Lima'
const DELIVERY_CUTOFF_HOUR = 16

function limaDateParts(now: Date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: LIMA_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(now)
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day),
        hour: Number(values.hour),
    }
}

function formatUtcDate(date: Date) {
    return [
        date.getUTCFullYear(),
        String(date.getUTCMonth() + 1).padStart(2, '0'),
        String(date.getUTCDate()).padStart(2, '0'),
    ].join('-')
}

export function getMinimumDeliveryDate(now = new Date()) {
    const lima = limaDateParts(now)
    const minimumDate = new Date(Date.UTC(lima.year, lima.month - 1, lima.day))
    minimumDate.setUTCDate(minimumDate.getUTCDate() + (lima.hour < DELIVERY_CUTOFF_HOUR ? 1 : 2))
    return formatUtcDate(minimumDate)
}

export function isDeliveryDateAllowed(value: unknown, now = new Date()) {
    const date = String(value || '')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false

    const [year, month, day] = date.split('-').map(Number)
    const parsed = new Date(Date.UTC(year, month - 1, day))
    if (formatUtcDate(parsed) !== date) return false

    return date >= getMinimumDeliveryDate(now)
}

export function formatDeliveryDate(value: string) {
    const [year, month, day] = value.split('-').map(Number)
    return new Intl.DateTimeFormat('es-PE', {
        timeZone: 'UTC',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(Date.UTC(year, month - 1, day)))
}
