<template>
    <div
        class="group bg-white rounded-2xl overflow-hidden transition flex flex-col"
    >
        <a :href="`/productos/${producto.slug}`">
            <div class="aspect-square overflow-hidden">
                <img
                    :src="producto.photo"
                    :alt="producto.name"
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div class="pt-2 flex flex-col flex-grow">
                <p class="text-gray-700 text-sm line-clamp-1 mb-1.5">
                    {{ producto.name }}
                </p>

                <div
                    v-if="producto.previous_price"
                    class="flex justify-between text-gray-400 text-sm"
                >
                    <span>Antes</span>
                    <span class="line-through">
                        S/ {{ producto.previous_price }}
                    </span>
                </div>

                <div class="flex justify-between text-gray-800 font-semibold">
                    <span>Precio</span>
                    <div class="flex flex-wrap items-baseline justify-end gap-x-2 gap-y-0.5">
                        <span>S/ {{ productPrice() }}</span>
                        <span
                            v-if="showPriceComparison()"
                            class="text-[10px] font-normal text-gray-500"
                            :class="{ 'line-through': isAuthenticated }"
                        >
                            {{ isAuthenticated ? 'Regular' : 'Club' }}: S/
                            {{ isAuthenticated ? regularPrice() : clubPrice() }}
                        </span>
                    </div>
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

<script lang="ts">
import { defineComponent } from 'vue'
import ShoppingCartPlus from '../assets/icons/shopping-cart-plus.vue';
import { Cart } from '../../src/lib/cart';
import { formatProductPrice, getProductPrice, hasClubPrice } from '../lib/pricing';

export default defineComponent({
    components: {
        ShoppingCartPlus,
    },
    props: {
        producto: {
            type: Object,
            required: true,
            default: () => ({}),
        },
        isAuthenticated: { type: Boolean, default: false },
    },
    data() {
        return {
            showToast: false,
            timeOutCloseToast: null,
        };
    },
    methods: {
        regularPrice() {
            return formatProductPrice(this.producto.regular_price ?? this.producto.price)
        },
        clubPrice() {
            return formatProductPrice(this.producto.club_price)
        },
        showPriceComparison() {
            return hasClubPrice({
                ...this.producto,
                price: this.producto.regular_price ?? this.producto.price,
            })
        },
        productPrice() {
            return formatProductPrice(
                getProductPrice(
                    {
                        ...this.producto,
                        price: this.producto.regular_price ?? this.producto.price,
                    },
                    this.isAuthenticated,
                ),
            )
        },
        addToCart() {
            Cart.add({
                ...this.producto,
                articulo: this.producto.articulo ?? this.producto.id,
                regular_price: this.producto.regular_price ?? this.producto.price,
                price: this.productPrice(),
                cantidad: 1,
            });
            clearTimeout(this.timeOutCloseToast);
            this.showToast = true;

            this.timeOutCloseToast = setTimeout(() => {
                this.showToast = false;
            }, 2500);
        },
    },
})
</script>
