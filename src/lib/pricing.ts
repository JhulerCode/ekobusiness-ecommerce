export function getProductPrice(product: Record<string, any> | null | undefined, isAuthenticated = false) {
    if (!product) return null

    const clubPrice = product.precio_club
    if (isAuthenticated && clubPrice !== undefined && clubPrice !== null && clubPrice !== '') {
        return clubPrice
    }

    return product.precio
}

export function formatProductPrice(value: unknown) {
    if (value === undefined || value === null || value === '') return ''
    const number = Number(value)
    return Number.isFinite(number) ? number.toFixed(2) : String(value)
}

export function hasClubPrice(product: Record<string, any> | null | undefined) {
    if (!product) return false

    const regular = Number(product.precio)
    const club = Number(product.precio_club)
    return (
        product.precio_club !== undefined &&
        product.precio_club !== null &&
        product.precio_club !== '' &&
        Number.isFinite(regular) &&
        Number.isFinite(club) &&
        regular !== club
    )
}
