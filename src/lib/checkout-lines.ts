import type { CartItem } from './cart'

export function toPromotionItems(items: CartItem[]) {
    return items.map((item) => ({
        ...item,
        quantity: Number(item.cantidad),
        unit_price: Number(item.pu),
    }))
}

export function toOrderLines(items: CartItem[]) {
    return items.map((item) => ({
        article_id: item.articulo,
        name: item.name,
        unit: item.unit,
        quantity: Number(item.cantidad),
        unit_price: Number(item.pu),
        line_name: item.line_name,
        presentation: item.presentation,
        blend_data: item.blend_datos,
    }))
}
