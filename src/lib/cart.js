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
        const existing = cart.find(p => p.id === producto.id);

        if (existing) {
            existing.cantidad += Number(producto.cantidad);
        } else {
            cart.push(producto);
        }

        this.save(cart);
    },

    clear() {
        this.save([]);
    },

    count() {
        return this.get().reduce((sum, p) => sum + Number(p.cantidad), 0);
    }
};

// export const Cart = {
//     get() {
//         return JSON.parse(localStorage.getItem('cart') || '[]')
//     },

//     save(items) {
//         localStorage.setItem('cart', JSON.stringify(items))
//     },

//     add(product, cantidad = 1) {
//         const cart = this.get()
//         const existing = cart.find(p => p.id === product.id)

//         if (existing) {
//             existing.cantidad += cantidad
//         } else {
//             cart.push({ ...product, cantidad })
//         }

//         this.save(cart)
//     },

//     remove(id) {
//         const cart = this.get().filter(p => p.id !== id)
//         this.save(cart)
//     },

//     clear() {
//         localStorage.removeItem('cart')
//     },

//     total() {
//         return this.get().reduce((sum, p) => sum + p.precio * p.cantidad, 0)
//     }
// }
