import { formatProductos, get } from './api'
import { getProductPrice } from './pricing'

const CART_KEY = 'sunka_cart'

export interface CartItem extends Record<string, any> {
    articulo: string | number
    cantidad: number
    pu: number
}

export const Cart = {
    get() {
        const data = localStorage.getItem(CART_KEY);
        return data ? JSON.parse(data) : [];
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
            if (producto.precio !== undefined && producto.precio !== null) existing.pu = producto.precio;
            if (producto.precio_regular !== undefined && producto.precio_regular !== null) {
                existing.precio_regular = producto.precio_regular;
            }
            if (producto.precio_club !== undefined && producto.precio_club !== null) {
                existing.precio_club = producto.precio_club;
            }
        } else {
            cart.push({
                articulo,
                nombre: producto.nombre,
                unidad: producto.unidad,
                has_fv: producto.has_fv,

                cantidad: producto.cantidad,

                pu: producto.precio,
                precio_regular: producto.precio_regular ?? producto.precio,
                precio_club: producto.precio_club,
                igv_afectacion: producto.igv_afectacion,
                igv_porcentaje: 18,

                foto: producto.foto,
                fotos: producto.fotos,

                linea: producto.linea,
                linea_nombre: producto.linea_nombre || producto.linea1?.nombre,
                presentacion: producto.presentacion || producto.ecommerce_data?.presentacion,

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
        return this.get().reduce((sum: number, item: CartItem) => sum + Number(item.cantidad), 0)
    },

    priceItems(items: CartItem[], isAuthenticated = false) {
        return items.map((item) => ({
            ...item,
            pu: getProductPrice(
                {
                    precio: item.precio_regular ?? item.pu,
                    precio_club: item.precio_club,
                },
                isAuthenticated,
            ),
        }))
    },

    async hydrateMetadata() {
        const cart = this.get()
        const missing = cart.filter(
            (item: CartItem) =>
                !item.linea_nombre ||
                !Array.isArray(item.presentacion) ||
                item.precio_club === undefined ||
                item.precio_regular === undefined,
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
                linea_nombre: product.linea1?.nombre,
                presentacion: product.presentacion,
                precio_regular: product.precio,
                precio_club: product.precio_club,
            }
        })
        this.save(hydrated)
        return hydrated
    }
};
