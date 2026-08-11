<template>
    <div class="inline-flex">
        <button
            ref="trigger"
            type="button"
            class="relative flex cursor-pointer text-current transition-colors duration-300 hover:text-sunka-brass-light"
            aria-label="Abrir carrito de compras"
            :aria-expanded="isOpen"
            aria-controls="cart-drawer"
            @click="open"
        >
            <ShoppingCart />

            <span
                v-if="count > 0"
                class="absolute -top-2.5 -right-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sunka-brass px-1.5 text-[10px] font-semibold leading-none text-sunka-ink"
            >
                {{ count }}
            </span>
        </button>

        <Teleport v-if="isMounted" to="body">
            <Transition name="cart-backdrop">
                <button
                    v-if="isOpen"
                    type="button"
                    class="fixed inset-0 z-[90] cursor-default bg-sunka-ink/55 backdrop-blur-[2px]"
                    aria-label="Cerrar carrito"
                    @click="close"
                ></button>
            </Transition>

            <Transition name="cart-drawer" @after-leave="restoreFocus">
                <aside
                    v-if="isOpen"
                    id="cart-drawer"
                    ref="drawer"
                    class="fixed top-0 right-0 z-[100] flex h-dvh w-full max-w-[540px] flex-col bg-sunka-cream text-sunka-ink shadow-2xl"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cart-drawer-title"
                >
                    <header
                        class="flex shrink-0 items-center justify-between border-b border-sunka-sand px-5 py-5 sm:px-8 sm:py-6"
                    >
                        <div>
                            <p
                                class="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-sunka-brass"
                            >
                                Tu selección
                            </p>
                            <h2
                                id="cart-drawer-title"
                                class="font-heading text-2xl font-medium tracking-[-0.02em] sm:text-3xl"
                            >
                                Carrito de compras
                            </h2>
                        </div>

                        <button
                            ref="closeButton"
                            type="button"
                            class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-sunka-stone/35 text-sunka-ink transition-colors duration-300 hover:border-sunka-ink hover:bg-sunka-ink hover:text-sunka-white"
                            aria-label="Cerrar carrito"
                            @click="close"
                        >
                            <span class="text-2xl font-light leading-none" aria-hidden="true">×</span>
                        </button>
                    </header>

                    <div v-if="items.length === 0" class="flex flex-1 flex-col items-center justify-center px-8 text-center">
                        <div
                            class="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-sunka-brass/35 text-sunka-brass"
                        >
                            <ShoppingCart />
                        </div>
                        <h3 class="font-heading text-2xl font-medium">Tu carrito está vacío</h3>
                        <p class="mt-3 max-w-sm text-sm leading-6 text-sunka-stone">
                            Descubre nuestros blends y encuentra el ritual que acompañará tus días.
                        </p>
                        <a
                            href="/tienda"
                            class="mt-8 inline-flex min-h-12 items-center justify-center bg-sunka-ink px-8 text-xs font-semibold uppercase tracking-[0.16em] text-sunka-white transition-colors duration-300 hover:bg-sunka-forest"
                        >
                            Explorar productos
                        </a>
                    </div>

                    <template v-else>
                        <div class="no-scrollbar flex-1 overflow-y-auto px-5 py-2 sm:px-8">
                            <p class="border-b border-sunka-sand py-4 text-xs uppercase tracking-[0.16em] text-sunka-stone">
                                {{ count }} {{ count === 1 ? 'producto' : 'productos' }}
                            </p>

                            <article
                                v-for="item in items"
                                :key="item.articulo"
                                class="grid grid-cols-[88px_1fr] gap-4 border-b border-sunka-sand py-5 sm:grid-cols-[104px_1fr] sm:gap-5"
                            >
                                <img
                                    :src="item.foto || '/placeholder.png'"
                                    :alt="item.nombre"
                                    class="h-24 w-[88px] bg-sunka-sand object-cover sm:h-28 sm:w-[104px]"
                                />

                                <div class="flex min-w-0 flex-col">
                                    <div class="flex items-start justify-between gap-3">
                                        <div class="min-w-0">
                                            <h3 class="font-heading text-base font-medium leading-5">
                                                {{ item.nombre }}
                                            </h3>
                                            <p v-if="item.unidad" class="mt-1 text-xs text-sunka-stone">
                                                {{ item.unidad }}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            class="shrink-0 cursor-pointer text-[10px] font-semibold uppercase tracking-[0.12em] text-sunka-stone underline decoration-sunka-stone/40 underline-offset-4 transition-colors hover:text-sunka-ink"
                                            :aria-label="`Eliminar ${item.nombre} del carrito`"
                                            @click="remove(item.articulo)"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    <div class="mt-auto flex items-end justify-between gap-4 pt-4">
                                        <div class="flex h-9 items-center border border-sunka-stone/40 bg-sunka-white">
                                            <button
                                                type="button"
                                                class="h-full w-9 text-lg font-light transition-colors hover:bg-sunka-sand disabled:cursor-not-allowed disabled:opacity-35"
                                                :disabled="Number(item.cantidad) <= 1"
                                                :aria-label="`Reducir cantidad de ${item.nombre}`"
                                                @click="changeQuantity(item, -1)"
                                            >
                                                −
                                            </button>
                                            <span class="min-w-8 text-center text-sm" aria-live="polite">
                                                {{ item.cantidad }}
                                            </span>
                                            <button
                                                type="button"
                                                class="h-full w-9 text-lg font-light transition-colors hover:bg-sunka-sand"
                                                :aria-label="`Aumentar cantidad de ${item.nombre}`"
                                                @click="changeQuantity(item, 1)"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div class="text-right">
                                            <p class="text-[11px] text-sunka-stone">
                                                {{ formatCurrency(item.pu) }} c/u
                                            </p>
                                            <p class="mt-0.5 font-heading text-lg font-semibold">
                                                {{ formatCurrency(Number(item.pu) * Number(item.cantidad)) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <footer class="shrink-0 border-t border-sunka-sand bg-sunka-white px-5 py-5 sm:px-8 sm:py-6">
                            <div class="space-y-2 text-sm text-sunka-stone">
                                <div class="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{{ formatCurrency(subtotal) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>IGV (18%)</span>
                                    <span>{{ formatCurrency(igv) }}</span>
                                </div>
                            </div>
                            <div class="mt-4 flex items-end justify-between border-t border-sunka-sand pt-4">
                                <span class="text-xs font-semibold uppercase tracking-[0.16em]">Total</span>
                                <span class="font-heading text-2xl font-semibold">{{ formatCurrency(total) }}</span>
                            </div>

                            <button
                                type="button"
                                class="mt-5 flex min-h-12 w-full cursor-pointer items-center justify-center border border-sunka-brass bg-sunka-brass px-6 text-xs font-semibold uppercase tracking-[0.16em] text-sunka-white transition-colors duration-300 hover:bg-sunka-brass-light hover:text-sunka-ink"
                                @click="checkout"
                            >
                                Proceder a la compra
                            </button>

                            <p v-if="error" class="mt-2 text-center text-xs text-red-700">
                                {{ error }}
                            </p>
                        </footer>
                    </template>
                </aside>
            </Transition>
        </Teleport>
    </div>
</template>

<script>
import ShoppingCart from '@/assets/icons/shopping-cart-plus.vue'
import { Cart } from '@/lib/cart.js'

export default {
    name: 'CartDrawer',
    components: { ShoppingCart },
    data() {
        return {
            isMounted: false,
            isOpen: false,
            items: [],
            error: null,
            previousBodyOverflow: '',
            onCartUpdated: null,
        }
    },
    computed: {
        count() {
            return this.items.reduce((sum, item) => sum + Number(item.cantidad), 0)
        },
        subtotal() {
            return this.total / 1.18
        },
        igv() {
            return this.total - this.subtotal
        },
        total() {
            return this.items.reduce(
                (sum, item) => sum + Number(item.pu) * Number(item.cantidad),
                0,
            )
        },
    },
    mounted() {
        this.isMounted = true
        this.load()
        this.onCartUpdated = (event) => {
            this.items = event.detail || Cart.get()
        }
        window.addEventListener('cart-updated', this.onCartUpdated)
        window.addEventListener('keydown', this.handleKeydown)
    },
    beforeUnmount() {
        window.removeEventListener('cart-updated', this.onCartUpdated)
        window.removeEventListener('keydown', this.handleKeydown)
        if (this.isOpen) document.body.style.overflow = this.previousBodyOverflow
    },
    methods: {
        load() {
            this.items = Cart.get()
        },
        open() {
            this.load()
            this.error = null
            this.isOpen = true
            this.previousBodyOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            this.$nextTick(() => this.$refs.closeButton?.focus())
        },
        close() {
            this.isOpen = false
            document.body.style.overflow = this.previousBodyOverflow
        },
        restoreFocus() {
            this.$refs.trigger?.focus()
        },
        handleKeydown(event) {
            if (event.key === 'Escape' && this.isOpen) this.close()
        },
        changeQuantity(item, amount) {
            const quantity = Math.max(1, Number(item.cantidad) + amount)
            const cart = this.items.map((currentItem) =>
                currentItem.articulo === item.articulo
                    ? { ...currentItem, cantidad: quantity }
                    : currentItem,
            )
            Cart.save(cart)
        },
        remove(id) {
            Cart.remove(id)
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN',
                minimumFractionDigits: 2,
            }).format(Number(value))
        },
        checkout() {
            if (this.total <= 0) {
                this.error = 'No se pudo calcular el total del carrito.'
                return
            }

            window.location.href = '/checkout'
        },
    },
}
</script>

<style scoped>
.cart-backdrop-enter-active,
.cart-backdrop-leave-active {
    transition: opacity 400ms ease;
}

.cart-backdrop-enter-from,
.cart-backdrop-leave-to {
    opacity: 0;
}

.cart-drawer-enter-active,
.cart-drawer-leave-active {
    transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.cart-drawer-enter-from,
.cart-drawer-leave-to {
    transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
    .cart-backdrop-enter-active,
    .cart-backdrop-leave-active,
    .cart-drawer-enter-active,
    .cart-drawer-leave-active {
        transition-duration: 1ms;
    }
}
</style>
