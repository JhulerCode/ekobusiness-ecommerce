<template>
    <div
        class="group bg-white rounded-2xl overflow-hidden transition flex flex-col"
    >
        <a :href="`/producto/${producto.slug}`">
            <div class="aspect-square overflow-hidden">
                <img
                    :src="producto.foto"
                    :alt="producto.nombre"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div class="pt-2 flex flex-col flex-grow">
                <p class="text-gray-700 text-sm line-clamp-1 mb-1.5">
                    {{ producto.nombre }}
                </p>

                <div
                    v-if="producto.precio_antes"
                    class="flex justify-between text-gray-400 text-sm"
                >
                    <span>Antes</span>
                    <span class="line-through">
                        S/ {{ producto.precio_antes }}
                    </span>
                </div>

                <div class="flex justify-between text-gray-800 font-semibold">
                    <span>Precio</span>
                    <span>S/ {{ producto.precio }}</span>
                </div>
            </div>
        </a>

        <button
            class="cursor-pointer ml-auto p-1 text-gray-800 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
            @click="addToCart(producto)"
        >
            <ShoppingCartPlus />
        </button>

        <transition name="fade">
            <div
                v-if="showToast"
                class="fixed top-12 right-15 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm flex items-center gap-3 z-50"
            >
                Producto agregado al carrito
            </div>
        </transition>
    </div>
</template>

<script>
import ShoppingCartPlus from '../assets/icons/shopping-cart-plus.vue';
import { Cart } from '../../src/lib/cart.js';

export default {
    components: {
        ShoppingCartPlus,
    },
    props: {
        producto: {
            type: Object,
            required: true,
            default: () => ({}),
        },
    },
    data() {
        return {
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
