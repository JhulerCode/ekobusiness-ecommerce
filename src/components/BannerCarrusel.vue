<template>
    <Carousel :items="productos" :perView="1" :gap="1" :speed="4000">
        <template #item="{ item }">
            <img
                :src="item.foto"
                :alt="item.nombre"
                loading="lazy"

            />
        </template>
    </Carousel>
</template>

<script>
import Carousel from './Carousel.vue'
import Producto from './Producto.vue'

export default {
    name: 'ProductosCarousel',
    components: { Carousel, Producto },
    props: {
        productos: { type: Array, default: () => [] },
    },
}
</script>
