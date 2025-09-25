<template>
    <section class="py-16 bg-white">
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
                    <!-- <div
                        class="group bg-white rounded-2xl overflow-hidden transition flex flex-col"
                        >
                    </div> -->
                    <Producto :producto="item" />
                </template>
            </Carousel>
        </div>
    </section>
</template>

<script>
import Carousel from './Carousel.vue';
import Producto from './Producto.vue';
import { getProductos } from '../lib/api';

export default {
    name: 'ProductosCarousel',
    components: { Carousel, Producto },
    data: () => ({
        productos: [],
    }),
    async mounted() {
        const productosFltr = {
            nombre: { op: 'Contiene', val: 'coca' },
        };
        this.productos = await getProductos(productosFltr);
    },
};
</script>
