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

    remove(id) {
        const cart = this.get().filter(p => p.id !== id);
        this.save(cart);
    },

    clear() {
        this.save([]);
    },

    count() {
        return this.get().reduce((sum, p) => sum + Number(p.cantidad), 0);
    }
};

// src/lib/cart.js
// const CART_KEY = 'sunka_cart';

// function isClient() {
//     return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
// }

// export const Cart = {
//     get() {
//         if (!isClient()) return [];
//         try {
//             const data = localStorage.getItem(CART_KEY);
//             return data ? JSON.parse(data) : [];
//         } catch (err) {
//             console.warn('Cart.get error', err);
//             return [];
//         }
//     },

//     save(cart) {
//         if (!isClient()) return;
//         try {
//             localStorage.setItem(CART_KEY, JSON.stringify(cart));
//             // emitir evento solo en cliente
//             window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
//         } catch (err) {
//             console.warn('Cart.save error', err);
//         }
//     },

//     add(producto) {
//         if (!isClient()) return;
//         const cart = this.get();
//         const existing = cart.find(p => p.id === producto.id);

//         if (existing) {
//             existing.cantidad = Number(existing.cantidad || 0) + Number(producto.cantidad || 1);
//         } else {
//             cart.push({
//                 id: producto.id,
//                 nombre: producto.nombre,
//                 precio: Number(producto.precio || 0),
//                 cantidad: Number(producto.cantidad || 1),
//                 imagen: producto.imagen || producto.imagen_principal || ''
//             });
//         }

//         this.save(cart);
//     },

//     remove(id) {
//         if (!isClient()) return;
//         const cart = this.get().filter(p => p.id !== id);
//         this.save(cart);
//     },

//     clear() {
//         if (!isClient()) return;
//         this.save([]);
//     },

//     count() {
//         if (!isClient()) return 0;
//         return this.get().reduce((sum, p) => sum + Number(p.cantidad || 0), 0);
//     },

//     total() {
//         if (!isClient()) return 0;
//         return this.get().reduce((sum, p) => sum + Number(p.precio || 0) * Number(p.cantidad || 0), 0);
//     }
// };
