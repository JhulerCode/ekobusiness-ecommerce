const CART_KEY = 'sunka_cart';

export const Cart = {
    get() {
        const data = localStorage.getItem(CART_KEY);
        return data ? JSON.parse(data) : [];
    },

    save(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
    },

    add(producto) {
        const cart = this.get();
        const existing = cart.find(p => p.articulo === producto.articulo);

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
            });
        }

        this.save(cart);
    },

    remove(articulo) {
        const cart = this.get().filter(p => p.articulo !== articulo);
        this.save(cart);
    },

    clear() {
        this.save([]);
    },

    count() {
        return this.get().reduce((sum, p) => sum + Number(p.cantidad), 0);
    }
};