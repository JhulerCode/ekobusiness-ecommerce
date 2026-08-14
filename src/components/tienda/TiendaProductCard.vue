<template>
    <article class="tienda-product-card group">
        <a :href="`/producto/${producto.slug}`" class="block">
            <div class="relative aspect-[1.05] overflow-hidden bg-sunka-sand/35">
                <img
                    :src="producto.foto"
                    :alt="producto.nombre"
                    loading="lazy"
                    class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span class="tienda-product-tag">
                    {{ productLabel }}
                </span>
            </div>

            <div class="flex min-h-[142px] flex-col px-4 pb-3 pt-4 pr-14">
                <h3 class="truncate text-sm font-semibold leading-tight text-sunka-ink">
                    {{ producto.nombre }}
                </h3>
                <p class="mt-2 line-clamp-2 text-xs leading-relaxed text-sunka-ink/60">
                    {{ productDescription }}
                </p>
                <div class="mt-auto flex items-end justify-between gap-3 pt-4">
                    <span class="font-semibold text-sm text-sunka-ink">S/ {{ producto.precio }}</span>
                </div>
            </div>
        </a>

        <button
            type="button"
            class="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-sunka-cream text-sunka-ink shadow-sm transition-colors duration-300 hover:bg-sunka-brass hover:text-sunka-white"
            :aria-label="`Agregar ${producto.nombre} al carrito`"
            @click.stop="addToCart"
        >
            <ShoppingCartPlus class="h-4 w-4" />
        </button>

        <transition name="fade">
            <div
                v-if="showToast"
                class="fixed right-5 top-20 z-[70] rounded-lg bg-sunka-ink px-5 py-3 text-sm text-sunka-white shadow-lg"
            >
                Producto agregado al carrito
            </div>
        </transition>
    </article>
</template>

<script>
import ShoppingCartPlus from '@/assets/icons/shopping-cart-plus.vue'
import { Cart } from '@/lib/cart.js'

export default {
    name: 'TiendaProductCard',
    components: { ShoppingCartPlus },
    props: {
        producto: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            showToast: false,
            toastTimeout: null,
        }
    },
    computed: {
        productLabel() {
            return this.producto.linea1?.nombre || this.producto.lineaNombre || 'SUNKA'
        },
        productDescription() {
            return (
                this.producto.descripcion ||
                this.producto.description ||
                'Una mezcla natural para acompañar tu momento.'
            )
        },
    },
    methods: {
        addToCart() {
            Cart.add({ ...this.producto, cantidad: 1 })
            clearTimeout(this.toastTimeout)
            this.showToast = true
            this.toastTimeout = setTimeout(() => {
                this.showToast = false
            }, 2500)
        },
    },
}
</script>

<style scoped>
.tienda-product-card {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(35, 29, 24, 0.1);
    border-radius: 8px;
    background: var(--sunka-white);
    transition:
        border-color 300ms ease,
        box-shadow 300ms ease,
        transform 300ms ease;
}

.tienda-product-card:hover {
    border-color: rgba(95, 100, 65, 0.35);
    box-shadow: 0 12px 26px rgba(35, 29, 24, 0.1);
    transform: translateY(-2px);
}

.tienda-product-tag {
    position: absolute;
    left: 10px;
    top: 10px;
    max-width: calc(100% - 20px);
    border-radius: 999px;
    background: rgba(245, 240, 231, 0.92);
    padding: 5px 9px;
    color: var(--sunka-ink);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.1em;
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
}
</style>
