<template>
    <section class="py-16 bg-gray-50">
        <div class="max-w-8xl mx-auto px-6">
            <div class="text-center mb-12">
                <h2
                    class="text-3xl md:text-4xl font-heading font-bold text-gray-900"
                >
                    Productos más vendidos
                </h2>
                <p class="mt-2 text-gray-600">
                    Descubre lo que nuestros clientes más disfrutan
                </p>
            </div>

            <Carousel :items="productos" :perView="4" :gap="1" :speed="4000">
                <template #item="{ item }">
                    <div
                        class="group bg-white rounded-2xl overflow-hidden transition flex flex-col"
                    >
                        <!-- Imagen -->
                        <div class="aspect-square overflow-hidden">
                            <img
                                :src="item.imagen"
                                :alt="item.nombre"
                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        <!-- Contenido -->
                        <div class="p-4 flex flex-col flex-grow">
                            <p
                                class="text-gray-700 text-sm line-clamp-2 mb-2 min-h-[2.5rem]"
                            >
                                {{ item.nombre }}
                            </p>

                            <div class="flex flex-col gap-1">
                                <div
                                    v-if="item.precio_antes"
                                    class="flex justify-between text-gray-400 text-sm"
                                >
                                    <span>Antes</span>
                                    <span class="line-through">
                                        S/ {{ item.precio_antes }}
                                    </span>
                                </div>

                                <div
                                    class="flex justify-between text-gray-700 font-semibold"
                                >
                                    <span>Precio</span>
                                    <span>S/ {{ item.precio }}</span>
                                </div>
                            </div>

                            <!-- Botón -->
                            <button
                                class="w-full mt-2 bg-black text-white border border-black py-2 px-4 rounded-lg font-medium shadow-sm hover:bg-white hover:text-black transition cursor-pointer"
                            >
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                </template>
            </Carousel>
        </div>
    </section>
</template>

<script>
import Carousel from './Carousel.vue';
import { getProductosDestacados } from '../lib/api';

export default {
    name: 'ProductosCarousel',
    components: { Carousel },
    data: () => ({
        productos: [],
    }),
    async mounted() {
        this.productos = await getProductosDestacados();
    },
};
</script>
