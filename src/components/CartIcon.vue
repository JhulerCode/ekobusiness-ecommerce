<template>
    <a href="/cart" class="relative inline-block">
        <ShoppingCart />

        <span
            v-if="count > 0"
            class="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full px-1.5 py-0.5"
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
