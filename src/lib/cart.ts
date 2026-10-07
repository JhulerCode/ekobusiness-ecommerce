import { formatProductos, get } from './api'
import { getProductPrice } from './pricing'

const CART_KEY = 'sunka_cart'

export interface CartItem extends Record<string, any> {
    articulo: string | number
    cantidad: number
    pu: number
}

function normalizeCartItem(item: Record<string, any>): CartItem {
    const normalized: Record<string, any> = { ...item }
    if (normalized.price === undefined && normalized.precio !== undefined) {
        normalized.price = normalized.precio
    }
    if (normalized.regular_price === undefined && normalized.precio_regular !== undefined) {
        normalized.regular_price = normalized.precio_regular
    }
    if (normalized.club_price === undefined && normalized.precio_club !== undefined) {
        normalized.club_price = normalized.precio_club
    }
    if (normalized.name === undefined && normalized.nombre !== undefined) {
        normalized.name = normalized.nombre
    }
    if (normalized.photo === undefined && normalized.foto !== undefined) {
        normalized.photo = normalized.foto
    }
    if (normalized.photos === undefined && normalized.fotos !== undefined) {
        normalized.photos = normalized.fotos
    }
    if (normalized.presentation === undefined && normalized.presentacion !== undefined) {
        normalized.presentation = normalized.presentacion
    }
    if (normalized.line_name === undefined && normalized.linea_nombre !== undefined) {
        normalized.line_name = normalized.linea_nombre
    }
    if (normalized.unit === undefined && normalized.unidad !== undefined) {
        normalized.unit = normalized.unidad
    }
    return normalized as CartItem
}

export const Cart = {
    get() {
        const data = localStorage.getItem(CART_KEY);
        const items = data ? JSON.parse(data) : [];
        return items.map(normalizeCartItem);
    },

    save(cart: CartItem[]) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
    },

    add(producto: Record<string, any>) {
        const cart = this.get();
        const articulo = producto.articulo ?? producto.id
        const matches = articulo == null
            ? []
            : cart.filter((item: CartItem) => item.articulo != null && String(item.articulo) === String(articulo))
        const existing = matches[0]

        if (existing) {
            existing.cantidad = matches.reduce((total: number, item: CartItem) => total + Number(item.cantidad || 0), 0) + Number(producto.cantidad || 1);
            for (let index = cart.length - 1; index >= 0; index -= 1) {
                if (cart[index] !== existing && cart[index].articulo != null && String(cart[index].articulo) === String(articulo)) {
                    cart.splice(index, 1)
                }
            }
            if (producto.price !== undefined && producto.price !== null) existing.pu = producto.price;
            if (producto.regular_price !== undefined && producto.regular_price !== null) {
                existing.regular_price = producto.regular_price;
            }
            if (producto.club_price !== undefined && producto.club_price !== null) {
                existing.club_price = producto.club_price;
            }
        } else {
            cart.push({
                articulo,
                name: producto.name,
                unit: producto.unit,
                has_fv: producto.has_expiry,

                cantidad: producto.cantidad,

                pu: producto.price,
                regular_price: producto.regular_price ?? producto.price,
                club_price: producto.club_price,
                igv_afectacion: producto.igv_afectacion,
                igv_porcentaje: 18,

                photo: producto.photo,
                photos: producto.photos,

                linea: producto.linea,
                line_name: producto.line_name || producto.line?.name,
                presentation: producto.presentation || producto.ecommerce_data?.presentation,

                blend_datos: producto.blend_datos,
            });
        }

        this.save(cart);
    },

    remove(articulo: string | number) {
        const cart = this.get().filter((item: CartItem) => item.articulo !== articulo)
        this.save(cart);
    },

    clear() {
        this.save([]);
    },

    count() {
        return this.get().reduce((sum: number, item: CartItem) => sum + Number(item.cantidad || 0), 0)
    },

    priceItems(items: CartItem[], isAuthenticated = false) {
        return items.map((item) => ({
            ...item,
            pu: getProductPrice(
                {
                    price: item.regular_price ?? item.pu,
                    club_price: item.club_price,
                },
                isAuthenticated,
            ),
        }))
    },

    async hydrateMetadata() {
        const cart = this.get()
        const missing = cart.filter(
            (item: CartItem) =>
                !item.line_name ||
                !Array.isArray(item.presentation) ||
                item.club_price === undefined ||
                item.regular_price === undefined,
        )
        if (!missing.length) return cart

        const res = await get('productos', {
            ids: missing.map((item: CartItem) => item.articulo),
        })
        if (!res.ok) return cart

        const products = formatProductos(res.data || [])
        const byId = new Map(products.map((product) => [String(product.id), product]))
        const hydrated = cart.map((item: CartItem) => {
            const product = byId.get(String(item.articulo))
            if (!product) return item
            return {
                ...item,
                linea: product.linea,
                line_name: product.line?.name,
                presentation: product.presentation,
                regular_price: product.price,
                club_price: product.club_price,
            }
        })
        this.save(hydrated)
        return hydrated
    }
};
