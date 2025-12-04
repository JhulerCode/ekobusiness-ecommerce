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

                    <a
                        :href="`/pedido/${a.id}?account=true`"
                        class="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                        Ver detalles
                    </a>
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
    </div>
</template>

<script>
import JdButton from "../components/JdButton.vue";

import { get } from "../lib/api.js";

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
        };
    },
    mounted() {
        if (!this.user.pedidos) {
            this.loadPedidos();
        }
    },
    methods: {
        async loadPedidos() {
            const qry = {
                cols: [
                    "fecha",
                    "codigo",
                    "pago_metodo",
                    "entrega_tipo",
                    "monto",
                    "moneda",
                    "estado",
                ],
                fltr: {
                    socio: { op: "Es", val: this.user.id },
                },
            };

            this.loading = true;
            const res = await get("socio_pedidos", { qry }, localStorage.getItem("token"));
            this.loading = false;

            if (res.code !== 0) return;

            this.user.pedidos = res.data;
        },
    },
};
</script>
