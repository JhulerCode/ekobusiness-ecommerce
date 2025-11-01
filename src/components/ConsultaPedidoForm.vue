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
                placeholder="Ejemplo: 456789123"
                :error="error"
            />

            <JdButton
                @click="consultarPedido"
                :loading="loading"
                text="Consultar pedido"
                class="!w-full"
            />
        </div>

        <div class="text-center text-xs text-gray-400 pt-4 border-t">
            © {{ new Date().getFullYear() }} EkoBusiness. Todos los derechos reservados.
        </div>
    </div>
</template>

<script>
import JdInput from "./JdInput.vue";
import JdButton from "./JdButton.vue";

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
        };
    },
    methods: {
        async consultarPedido() {
            this.error = "";
            if (!this.codigo.trim()) {
                this.error = "Por favor, ingresa un número de pedido.";
                return;
            }

            this.loading = true;
            try {
                const res = await fetch(
                    `${import.meta.env.PUBLIC_API_URL}/store/pedidos/uno/${this.codigo}`
                );
                if (!res.ok) throw new Error("No se pudo conectar con el servidor.");

                const data = await res.json();

                if (data && data.code === 200) {
                    // Pedido encontrado → redirigir
                    window.location.href = `/pedido/${this.codigo}`;
                } else {
                    this.error = "No se encontró ningún pedido con ese número.";
                }
            } catch (err) {
                this.error = "Ocurrió un error al consultar el pedido.";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
