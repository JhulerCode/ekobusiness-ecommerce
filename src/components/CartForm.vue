<template>
    <section class="max-w-6xl mx-auto px-4 py-12">
        <!-- Encabezado del carrito -->
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-semibold">Carrito de compras</h2>
            <span class="text-gray-500 text-sm">
                {{ items.length }}
                {{ items.length === 1 ? "producto" : "productos" }}
            </span>
        </div>

        <!-- Si el carrito está vacío -->
        <div
            v-if="items.length === 0"
            class="text-gray-700 text-center py-20 border border-gray-200 rounded-2xl bg-gray-50"
        >
            <h3 class="text-xl font-semibold mb-3">¡Tu carrito de compras está vacío!</h3>
            <p class="text-gray-500 max-w-md mx-auto mb-8">
                Aún no has agregado productos a tu carrito de compras. Visita nuestra página
                principal y descubre todo lo que tenemos para ti.
            </p>

            <a
                href="/"
                class="inline-block bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition"
            >
                Explorar productos
            </a>
        </div>

        <!-- Si hay productos -->
        <div v-else class="grid md:grid-cols-3 gap-10 items-start">
            <!-- Lista de productos -->
            <div class="md:col-span-2 space-y-6">
                <div
                    v-for="item in items"
                    :key="item.id"
                    class="flex flex-col md:flex-row gap-4 border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition relative bg-white"
                >
                    <!-- Imagen -->
                    <img
                        :src="item.foto || '/placeholder.png'"
                        :alt="item.nombre"
                        class="w-full md:w-28 h-28 object-cover rounded-xl border border-gray-100"
                    />

                    <!-- Contenido principal -->
                    <div class="flex justify-between flex-1">
                        <div>
                            <h3 class="font-medium text-gray-800">
                                {{ item.nombre }}
                            </h3>

                            <p class="text-sm text-gray-500 mt-1">
                                <span class="font-medium">S/ {{ item.pu }} c/u</span>
                            </p>

                            <div class="flex items-center gap-3 mt-3">
                                <JdInput
                                    type="number"
                                    min="1"
                                    v-model="item.cantidad"
                                    @change="updateQuantity(item)"
                                    class="w-20"
                                />
                            </div>
                        </div>

                        <!-- Precio total de este ítem -->
                        <div class="flex items-center justify-between">
                            <p class="text-lg font-semibold text-gray-900">
                                S/
                                {{ (item.pu * item.cantidad).toFixed(2) }}
                            </p>
                        </div>
                    </div>

                    <!-- Botón eliminar -->
                    <button
                        @click="remove(item.articulo)"
                        class="absolute bottom-4 right-5 text-sm text-gray-600 hover:text-red-600 transition cursor-pointer"
                    >
                        Eliminar
                    </button>
                </div>
            </div>

            <!-- Resumen del pedido -->
            <div class="border border-gray-200 rounded-2xl p-6 h-fit bg-gray-50">
                <h2 class="text-xl font-semibold mb-6">Resumen del pedido</h2>

                <div class="flex justify-between text-gray-700 mb-2">
                    <span>Subtotal</span>
                    <span>S/ {{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-gray-700 mb-2">
                    <span>IGV (18%)</span>
                    <span>S/ {{ igv.toFixed(2) }}</span>
                </div>
                <div
                    class="flex justify-between text-gray-900 text-lg font-semibold mt-4 border-t border-gray-200 pt-4"
                >
                    <span>Total</span>
                    <span>S/ {{ total.toFixed(2) }}</span>
                </div>

                <button
                    @click="checkout"
                    class="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition cursor-pointer"
                >
                    Proceder compra
                </button>

                <p v-if="error" class="input-error">
                    {{ error }}
                </p>
            </div>
        </div>
    </section>
</template>

<script>
import { Cart } from "../lib/cart.js";
import JdInput from "../components/JdInput.vue";

export default {
    name: "CartForm",
    components: {
        JdInput,
    },
    data() {
        return {
            items: [],
            error: null,
        };
    },
    computed: {
        subtotal() {
            return this.total / 1.18;
        },
        igv() {
            return this.subtotal * 0.18;
        },
        total() {
            return this.items.reduce((s, i) => s + Number(i.pu) * Number(i.cantidad), 0);
        },
    },
    methods: {
        load() {
            this.items = Cart.get();
        },
        updateQuantity(item) {
            // guarda cambios
            const list = this.items.map((i) =>
                i.articulo === item.articulo ? { ...i, cantidad: Number(item.cantidad) } : i
            );
            Cart.save(list);
            this.load(); // recargar (simple)
        },
        remove(id) {
            Cart.remove(id);
            this.load();
        },
        checkout() {
            const cart = Cart.get();

            if (this.total < 0) {
                this.error = "Datos incorrectos";
                return;
            }

            window.location.href = "/checkout";
        },
    },
    mounted() {
        this.load();

        // actualizar cuando otro componente emita cambio
        this._onUpdate = (e) => {
            this.items = e.detail || Cart.get();
        };
        window.addEventListener("cart-updated", this._onUpdate);
    },
    beforeUnmount() {
        window.removeEventListener("cart-updated", this._onUpdate);
    },
};
</script>
