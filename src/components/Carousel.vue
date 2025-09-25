<template>
    <div>
        <div class="carrusel">
            <button
                type="button"
                class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border border-gray-900 bg-white hover:bg-gray-100 transition cursor-pointer"
                :style="{ fontSize: sizeArrows + 'rem' }"
                @click="moveSlider(false)"
                aria-label="Anterior"
            >
                <ArrowLeft />
            </button>

            <div>
                <ul
                    ref="move"
                    :style="{
                        'grid-auto-columns': `calc((100% - (${gap}rem * (${currentPerView} - 1))) / ${currentPerView})`,
                        gap: gap + 'rem',
                    }"
                >
                    <li v-for="(item, index) in extendedItems" :key="index">
                        <slot name="item" :item="item"></slot>
                    </li>
                </ul>
            </div>

            <button
                type="button"
                class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border border-gray-900 bg-white hover:bg-gray-100 transition cursor-pointer"
                :style="{ fontSize: sizeArrows + 'rem' }"
                @click="moveSlider(true)"
                aria-label="Siguiente"
            >
                <ArrowRight />
            </button>
        </div>

        <div class="indicadores flex justify-center mt-4 gap-2">
            <button
                v-for="(_, i) in cantidadItems"
                :key="i"
                @click="goToSlide(i)"
                :class="[
                    'block h-2 rounded-full bg-gray-300 transition-all duration-300 cursor-pointer',
                    i === scrollSlide % cantidadItems
                        ? 'w-8 bg-gray-900'
                        : 'w-3',
                ]"
            ></button>
        </div>
    </div>
</template>

<script>
import ArrowLeft from '../assets/icons/chevron-left.vue';
import ArrowRight from '../assets/icons/chevron-right.vue';

export default {
    components: {
        ArrowLeft,
        ArrowRight,
    },
    props: {
        items: { type: Array, default: () => [] },
        perView: { type: Number, default: 1 },
        gap: { type: Number, default: 1 },
        speed: { type: Number, default: 5000 },
        sizeArrows: { type: Number, default: 1 },
        colorArrows: { type: String, default: '#fff' },
    },
    data: () => ({
        rem: 0,
        cantidad: 0,
        scrollSlide: 0,
        interval: null,
        currentPerView: 1,
    }),
    computed: {
        extendedItems() {
            return [...this.items, ...this.items.slice(0, this.perView)];
        },
        cantidadItems() {
            return this.items.length;
        },
    },
    mounted() {
        this.rem = this.getRemSizeInPixels();
        this.updatePerView();
        this.initInterval();

        window.addEventListener('resize', this.updatePerView);
    },
    unmounted() {
        clearInterval(this.interval);

        window.removeEventListener('resize', this.updatePerView);
    },
    methods: {
        updatePerView() {
            const w = window.innerWidth;
            if (w < 640) {
                // móvil
                this.currentPerView = 1;
            } else if (w < 1024) {
                // tablet
                this.currentPerView = Math.min(2, this.perView);
            } else {
                // escritorio
                this.currentPerView = this.perView;
            }
        },
        initInterval() {
            this.interval = setInterval(() => {
                this.moveSlider(2, 14);
            }, this.speed);
        },
        moveSlider(next = true) {
            clearInterval(this.interval);

            const slider = this.$refs.move;

            if (next) {
                this.scrollSlide++;

                if (this.scrollSlide == this.cantidadItems + 1) {
                    this.scrollSlide = 1;
                    slider.style.transition = '0s';
                    slider.style.left = '0';
                }
            } else {
                this.scrollSlide--;

                if (this.scrollSlide < 0) {
                    this.scrollSlide = this.cantidadItems;
                    slider.style.transition = '0s';
                    const widthEl =
                        slider.querySelector(':first-child').offsetWidth +
                        this.rem * this.gap;
                    slider.style.left = `-${this.scrollSlide * widthEl}px`;
                    this.scrollSlide--;
                }
            }

            const widthEl =
                slider.querySelector(':first-child').offsetWidth +
                this.rem * this.gap;
            slider.style.left = `-${this.scrollSlide * widthEl}px`;
            slider.style.transition = '0.3s';

            this.initInterval();
        },
        getRemSizeInPixels() {
            const tempDiv = document.createElement('div');
            tempDiv.style.fontSize = '1rem';
            document.body.appendChild(tempDiv);

            const fontSizeInPixels = window.getComputedStyle(tempDiv).fontSize;
            document.body.removeChild(tempDiv);
            return parseFloat(fontSizeInPixels);
        },
        goToSlide(index) {
            clearInterval(this.interval);

            const slider = this.$refs.move;
            this.scrollSlide = index;

            const widthEl =
                slider.querySelector(':first-child').offsetWidth +
                this.rem * this.gap;
            slider.style.left = `-${this.scrollSlide * widthEl}px`;
            slider.style.transition = '0.3s';

            this.initInterval();
        },
    },
};
</script>

<style scoped>
.carrusel {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}
.carrusel > div {
    overflow-x: hidden;
}
.carrusel > div ul {
    display: grid;
    grid-auto-flow: column;
    position: relative;
    left: 0;
    transition: 0.3s;
}

ul {
    margin: 0 !important;
    padding: 0 !important;
    list-style: none !important;
}
</style>
