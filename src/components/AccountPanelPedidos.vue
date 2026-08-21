<template>
    <div>
        <div class="flex justify-between mb-4">
            <h2 class="text-xl font-semibold">
                {{ headText }}
            </h2>

            <JdButton text="Recargar" tipo="2" :loading="loading" @click="loadPedidos" />
        </div>

        <div v-if="user.pedidos && user.pedidos.length > 0" class="space-y-4">
            <div
                v-for="(a, i) in user.pedidos"
                :key="a.id"
                class="flex justify-between items-start bg-gray-50 p-4 rounded-xl border border-gray-200"
            >
                <div>
                    <p class="font-medium text-gray-800">#{{ a.codigo }}</p>

                    <p class="text-sm text-gray-600">
                        {{ new Date(a.fecha).toLocaleDateString("es-PE") }} |
                        {{ a.entrega_tipo1.nombre }} | {{ a.pago_metodo1.nombre }}
                    </p>

                    <button
                        type="button"
                        :disabled="openingOrderId === a.id"
                        @click="openPedido(a.id)"
                        class="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                        {{ openingOrderId === a.id ? 'Abriendo...' : 'Ver detalles' }}
                    </button>
                </div>

                <div class="flex flex-col text-right">
                    <p>{{ a.moneda1?.simbolo }}{{ a.monto }}</p>

                    <span
                        class="px-3 py-1 text-xs font-medium rounded-full"
                        :class="[
                            a.estado1?.nombre === 'ABIERTO'
                                ? 'bg-yellow-100 text-yellow-800'
                                : a.estado1?.nombre === 'CERRADO'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800',
                        ]"
                    >
                        {{ a.estado1?.nombre }}
                    </span>
                </div>
            </div>
        </div>

        <div v-else class="text-gray-600 text-center">
            <p>No tienes pedidos registrados.</p>
        </div>

        <p v-if="error" class="mt-4 text-sm text-red-700">{{ error }}</p>
    </div>
</template>

<script>
import JdButton from "../components/JdButton.vue";

import { get, post, urls } from "../lib/api.js";

export default {
    components: {
        JdButton,
    },
    props: {
        headText: { type: String, default: "" },
        user: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            loading: false,
            openingOrderId: null,
            error: '',
        };
    },
    mounted() {
        if (!this.user.pedidos) {
            this.loadPedidos();
        }
    },
    methods: {
        async loadPedidos() {
            this.loading = true;
            const res = await get("socio_pedidos", {}, localStorage.getItem("token"));
            this.loading = false;

            if (res.code !== 0) return;

            this.user.pedidos = res.data;
        },
        async openPedido(id) {
            this.error = ''
            this.openingOrderId = id
            const res = await post(
                `${urls.socio_pedidos}/${id}/access`,
                {},
                false,
                localStorage.getItem('token'),
            )
            this.openingOrderId = null

            if (res.code !== 0) {
                this.error = res.msg || 'No se pudo abrir el pedido.'
                return
            }

            const accessToken = encodeURIComponent(res.data.access_token)
            window.location.href = `/pedidos/${id}?account=true&access_token=${accessToken}`
        },
    },
};
</script>
