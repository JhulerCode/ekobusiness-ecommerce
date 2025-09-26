<template>
    <div class="flex gap-4">
        <div class="flex flex-col gap-2">
            <img
                v-for="(foto, index) in producto.fotos"
                :key="foto.id"
                :src="foto.url"
                :alt="`${producto.nombre} ${index + 1}`"
                @click="seleccionarImagen(index)"
                :class="[
                    'w-20 h-20 object-cover rounded-lg cursor-pointer',
                    index === imagenSeleccionada
                        ? 'ring-2 ring-black'
                        : 'hover:ring-2 hover:ring-black',
                ]"
            />
        </div>

        <!-- <div class="flex-1">
            <img
                :src="producto.fotos[imagenSeleccionada].url"
                :alt="producto.nombre"
                class="w-full h-auto rounded-2xl object-cover shadow-md"
            />
        </div> -->

        <div
            class="relative overflow-hidden rounded-2xl flex-1 shadow-md"
            @mousemove="handleMouseMove"
            @mouseleave="resetZoom"
            ref="container"
            style="cursor: zoom-in"
        >
            <img
                :src="producto.fotos[imagenSeleccionada].url"
                :alt="producto.nombre"
                class="w-full h-auto object-cover transition-transform duration-200"
                :style="imgStyle"
                ref="image"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        producto: { type: Object, required: true, default: () => ({}) },
    },
    data() {
        return {
            imagenSeleccionada: 0,
            imgStyle: {
                transform: 'scale(1) translate(0,0)',
                transformOrigin: 'center center',
            },
        };
    },
    methods: {
        seleccionarImagen(index) {
            this.imagenSeleccionada = index;
        },
        handleMouseMove(e) {
            const container = this.$refs.container;
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            this.imgStyle.transform = 'scale(1.5)';
            this.imgStyle.transformOrigin = `${x}% ${y}%`;
        },
        resetZoom() {
            this.imgStyle.transform = 'scale(1)';
            this.imgStyle.transformOrigin = 'center center';
        },
    },
};
</script>

<style scoped>
img {
    will-change: transform;
}
</style>
