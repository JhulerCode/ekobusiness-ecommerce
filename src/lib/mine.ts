function genId() {
    return `${Date.now()}${Math.floor(Math.random() * 900) + 100}`
}

function redondear(num: number | null | undefined, dec = 2) {
    if (num === null || num === undefined) return num

    return num.toLocaleString('en-US', {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec
    })
}

function formatDate(fecha: string | number | Date | null | undefined) {
    if (fecha === null || fecha === undefined) return fecha

    if (typeof fecha === 'string') {
        const dateOnly = fecha.match(/^(\d{4})-(\d{2})-(\d{2})$/)
        if (dateOnly) return `${dateOnly[3]}/${dateOnly[2]}/${dateOnly[1]}`
    }

    const date = new Date(fecha)
    if (Number.isNaN(date.getTime())) return ''

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')

    return `${day}/${month}/${date.getFullYear()}`
}

function formatDateTime(fecha: string | number | Date | null | undefined) {
    if (fecha === null || fecha === undefined) return fecha

    return new Date(fecha).toLocaleString("es-PE", {
        dateStyle: "short",
        timeStyle: "short",
    })
}

export {
    genId,
    redondear,
    formatDate,
    formatDateTime,
}
