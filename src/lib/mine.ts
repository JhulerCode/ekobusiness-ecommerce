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

    return new Date(fecha).toLocaleDateString("es-PE")
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
