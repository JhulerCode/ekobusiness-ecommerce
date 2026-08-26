<template>
    <div>
        <div class="mb-8 flex flex-col gap-5 border-b border-sunka-sand pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-sunka-brass">
                    Historial de compra
                </p>
                <h2 class="mt-2 font-heading text-2xl font-semibold text-sunka-forest">
                    {{ headText }}
                </h2>
                <p class="mt-1 text-sm text-sunka-stone">Consulta el estado y detalle de tus compras.</p>
            </div>

            <JdButton
                text="Actualizar"
                tipo="2"
                :loading="loading"
                @click="loadPedidos"
                class="!h-10 !rounded-none !border-sunka-sand !px-5 !py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sunka-forest"
            />
        </div>

        <div v-if="user.pedidos && user.pedidos.length > 0" class="divide-y divide-sunka-sand border border-sunka-sand">
            <div
                v-for="(a, i) in user.pedidos"
                :key="a.id"
                class="flex flex-col gap-5 bg-sunka-white p-5 transition-colors hover:bg-sunka-cream/55 sm:flex-row sm:items-start sm:justify-between sm:p-6"
            >
                <div>
                    <p class="font-heading text-lg font-semibold text-sunka-forest">Pedido #{{ a.codigo }}</p>

                    <p class="mt-1 text-xs leading-relaxed text-sunka-stone sm:text-sm">
                        {{ new Date(a.fecha).toLocaleDateString("es-PE") }} |
                        {{ a.entrega_tipo1.nombre }} | {{ a.pago_metodo1.nombre }}
                    </p>

                    <button
                        type="button"
                        :disabled="openingOrderId === a.id"
                        @click="openPedido(a.id)"
                        class="mt-3 cursor-pointer border-b border-sunka-brass pb-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-sunka-forest transition-colors hover:text-sunka-brass disabled:cursor-wait disabled:opacity-60"
                    >
                        {{ openingOrderId === a.id ? 'Abriendo...' : 'Ver detalles' }}
                    </button>
                </div>

                <div class="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:text-right">
                    <p class="font-heading text-xl font-semibold text-sunka-ink">{{ a.moneda1?.simbolo }}{{ a.monto }}</p>

                    <span
                        class="border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]"
                        :class="[
                            a.estado1?.nombre === 'ABIERTO'
                                ? 'border-sunka-brass/40 bg-sunka-cream text-sunka-brass'
                                : a.estado1?.nombre === 'CERRADO'
                                ? 'border-sunka-olive/30 bg-sunka-olive/10 text-sunka-olive'
                                : 'border-sunka-sand bg-sunka-cream text-sunka-stone',
                        ]"
                    >
                        {{ a.estado1?.nombre }}
                    </span>
                </div>
            </div>
        </div>

        <div v-else class="border border-dashed border-sunka-sand bg-sunka-cream/45 px-5 py-12 text-center">
            <p class="font-heading text-lg font-semibold text-sunka-forest">Aún no tienes pedidos</p>
            <p class="mt-1 text-sm text-sunka-stone">Tus próximas compras aparecerán aquí.</p>
        </div>

        <p v-if="error" class="mt-4 border-l-2 border-[var(--sunka-danger)] bg-[#f8eee9] px-3 py-2 text-sm text-[var(--sunka-danger)]">{{ error }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import JdButton from "../components/JdButton.vue";

import { get, post, urls } from "../lib/api";

export default defineComponent({
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
            const res = await get('socio_pedidos')
            this.loading = false;

            if (!res.ok) return;

            this.user.pedidos = res.data;
        },
        async openPedido(id) {
            this.error = ''
            this.openingOrderId = id
            const res = await post(
                `${urls.socio_pedidos}/${id}/access`,
                {},
                false,
            )
            this.openingOrderId = null

            if (!res.ok) {
                this.error = res.problem.detail || 'No se pudo abrir el pedido.'
                return
            }

            window.location.href = res.data.redirect_url
        },
    },
})
</script>
