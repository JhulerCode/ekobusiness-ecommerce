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
        const existing = cart.find((item: CartItem) => item.articulo === producto.articulo)

        if (existing) {
            existing.cantidad += Number(producto.cantidad);
        } else {
            cart.push({
                articulo: producto.id,
                nombre: producto.nombre,
                unidad: producto.unidad,
                has_fv: producto.has_fv,

                cantidad: producto.cantidad,

                pu: producto.precio,
                igv_afectacion: producto.igv_afectacion,
                igv_porcentaje: 18,

                foto: producto.foto,
                fotos: producto.fotos,

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
    }
};
