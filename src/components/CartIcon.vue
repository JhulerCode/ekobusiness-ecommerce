<template>
    <a href="/cart" class="relative inline-block">
        <ShoppingCart />

        <span
            v-if="count > 0"
            class="absolute -top-3 -right-2 bg-gray-900 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1.5"
        >
            {{ count }}
        </span>
    </a>
</template>

<script>
import ShoppingCart from '../assets/icons/shopping-cart-plus.vue';
import { Cart } from '../../src/lib/cart.js';

export default {
    components: { ShoppingCart },
    data() {
        return { count: 0 };
    },
    mounted() {
        this.count = Cart.count();

        window.addEventListener('cart-updated', (e) => {
            this.count = e.detail.reduce(
                (sum, p) => sum + Number(p.cantidad),
                0
            );
        });
    },
    beforeUnmount() {
        window.removeEventListener('cart-updated');
    },
};
</script>
