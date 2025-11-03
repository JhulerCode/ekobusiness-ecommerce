<template>
    <div class="bg-white shadow-md rounded-2xl p-8 w-full max-w-md space-y-6">
        <div class="text-center space-y-2">
            <h1 class="text-2xl font-semibold text-gray-800">Consulta el estado de tu pedido</h1>
            <p class="text-gray-500 text-sm">
                Ingresa el número de pedido que recibiste al hacer tu compra.
            </p>
        </div>

        <div class="space-y-4">
            <JdInput
                label="Número de pedido"
                v-model="codigo"
                placeholder="Ejemplo: 1762018452516211"
                :error="error"
            />

            <JdButton
                @click="consultarPedido"
                :loading="loading"
                text="Consultar pedido"
                class="!w-full"
            />
        </div>

        <div class="text-center text-xs text-gray-400 pt-4 border-t space-y-1">
            <p>
                Si tienes algún inconveniente con tu pedido, puedes escribirnos a
                <a :href="`mailto:${contactEmail}`" class="text-blue-500 hover:underline">
                    {{ contactEmail }}
                </a>
            </p>
        </div>
    </div>
</template>

<script>
import JdInput from "./JdInput.vue";
import JdButton from "./JdButton.vue";
import { get } from "../lib/api.js";
import { contactEmail } from "../lib/empresa.js";

export default {
    components: {
        JdButton,
        JdInput,
    },
    data() {
        return {
            codigo: "",
            error: "",
            loading: false,
            contactEmail,
        };
    },
    methods: {
        async consultarPedido() {
            this.error = "";
            if (!this.codigo.trim()) {
                this.error = "Por favor, ingresa un número de pedido.";
                return;
            }

            const qry = {
                fltr: { codigo: { op: "Es", val: this.codigo } },
                cols: ["codigo"],
            };

            this.loading = true;
            const res = await get("socio_pedidos", { qry });
            this.loading = false;

            if (res.code < 0) {
                this.error = "Algo salió mal.";
            }
            if (res.code > 0) {
                this.error = res.msg;
            } else if (res.code == 0) {
                if (res.data.length > 0) {
                    window.location.href = `/pedido/${res.data[0].id}`;
                } else {
                    this.error = "El pedido no existe.";
                }
            }
        },
    },
};
</script>
