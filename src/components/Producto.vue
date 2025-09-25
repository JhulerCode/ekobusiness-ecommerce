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

                <div class="flex justify-between text-gray-700 font-semibold">
                    <span>Precio</span>
                    <span>S/ {{ producto.precio }}</span>
                </div>
            </div>
        </a>

        <div class="flex">
            <!-- <button class="cursor-pointer" @click="agregarAlCarrito(producto)"> -->
            <button
                class="cursor-pointer ml-auto p-1 text-black rounded-full hover:bg-gray-200 transition flex items-center justify-center"
                @click="agregarAlCarrito(producto)"
            >
                <ShoppingCartPlus />
            </button>
        </div>
    </div>
</template>

<script>
import ShoppingCartPlus from '../assets/icons/shopping-cart-plus.vue';

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
    methods: {
        agregarAlCarrito(producto) {
            console.log('Producto añadido:', producto.nombre);
        },
    },
};
</script>
