<template>
    <Carousel :items="productos" :perView="4" :gap="1" :speed="4000">
        <template #item="{ item }">
            <Producto :producto="item" />
        </template>
    </Carousel>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Carousel from './Carousel.vue';
import Producto from './Producto.vue';

export default defineComponent({
    name: 'ProductosCarousel',
    components: { Carousel, Producto },
    props: {
        productos: { type: Array, default: () => [] },
    },
})
</script>
