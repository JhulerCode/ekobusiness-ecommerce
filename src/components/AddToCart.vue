<template>
    <div class="flex items-center gap-4 mb-6">
        <label for="cantidad" class="text-sm text-gray-600">Cantidad:</label>
        <input
            id="cantidad"
            type="number"
            min="1"
            class="w-20 border border-gray-300 rounded-lg p-2 text-center focus:outline-none focus:ring-2 focus:ring-black"
            v-model="cantidad"
        />
    </div>

    <button
        class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer"
        @click="addToCart"
    >
        <ShoppingCartPlus />
        Agregar al carrito
    </button>

    <transition name="fade">
        <div
            v-if="showToast"
            class="fixed top-12 right-15 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm flex items-center gap-3 z-50"
        >
            Producto agregado al carrito
        </div>
    </transition>
</template>

<script>
import ShoppingCartPlus from '../assets/icons/shopping-cart-plus.vue';
import { Cart } from '../../src/lib/cart.js';

export default {
    components: {
        ShoppingCartPlus,
    },
    props: {
        producto: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            cantidad: 1,
            showToast: false,
            timeOutCloseToast: null,
        };
    },
    methods: {
        addToCart() {
            Cart.add({ ...this.producto, cantidad: this.cantidad });
            clearTimeout(this.timeOutCloseToast);
            this.showToast = true;

            this.timeOutCloseToast = setTimeout(() => {
                this.showToast = false;
            }, 2500);
        },
    },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
