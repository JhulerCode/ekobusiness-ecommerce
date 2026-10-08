<template>
    <div class="space-y-8" v-if="!enviado">
        <!-- Datos personales -->
        <div>
            <h2 class="text-lg font-medium mb-4 text-neutral-900">Datos personales</h2>

            <div class="grid md:grid-cols-2 gap-4">
                <JdInput
                    label="Nombres"
                    :nec="true"
                    v-model="form.first_name"
                    :error="errors.first_name"
                />

                <JdInput
                    label="Apellidos"
                    :nec="true"
                    v-model="form.last_name"
                    :error="errors.last_name"
                />

                <JdSelect
                    label="Tipo de documento"
                    :nec="true"
                    :lista="identity_documents"
                    v-model="form.document_type"
                    :error="errors.document_type"
                />

                <JdInput
                    label="Nro de documento"
                    :nec="true"
                    v-model="form.document_number"
                    :error="errors.document_number"
                />

                <JdInput label="Correo" :nec="true" v-model="form.email" :error="errors.email" />

                <JdInput
                    label="Dirección"
                    :nec="true"
                    v-model="form.address"
                    :error="errors.address"
                />

                <JdCheckBox label="Soy menor de edad" v-model="form.is_minor" />
            </div>
        </div>

        <!-- Pedido -->
        <div>
            <h2 class="text-lg font-medium mb-4 text-neutral-900">
                Datos del representante del titular (si aplica)
            </h2>

            <p class="text-sm text-gray-600 mb-4">
                Estos datos nos ayudarán a resolver tu reclamo de manera más rápida.
            </p>

            <div class="grid md:grid-cols-2 gap-4">
                <JdInput
                    label="Nro de pedido"
                    :nec="true"
                    v-model="form.order_code"
                    :error="errors.order_code"
                />

                <JdInput
                    label="Monto reclamado en soles"
                    :nec="true"
                    type="number"
                    v-model="form.amount"
                    :error="errors.amount"
                />

                <JdTextArea
                    label="Descripción del producto"
                    :nec="true"
                    v-model="form.product_description"
                    :error="errors.product_description"
                    class="md:col-span-2"
                />
            </div>
        </div>

        <!-- Detalles -->
        <div>
            <h2 class="text-lg font-medium mb-4 text-neutral-900">Detalles de la solicitud</h2>

            <div class="grid gap-4">
                <JdRadio
                    label="Tipo"
                    :nec="true"
                    :lista="solicitud_tipos"
                    v-model="form.claim_type"
                    :error="errors.claim_type"
                    :with-border="true"
                />

                <JdTextArea
                    label="Resumen de tu reclamo"
                    :nec="true"
                    v-model="form.summary"
                    :error="errors.summary"
                />

                <JdTextArea
                    label="Detalle de tu solicitud"
                    :nec="true"
                    v-model="form.description"
                    :error="errors.description"
                />
            </div>
        </div>

        <div class="flex flex-col items-center">
            <JdButton text="Enviar" @click="enviar" :loading="loading" class="!w-60" />

            <p v-if="errors.general" class="input-error">
                {{ errors.general }}
            </p>
        </div>
    </div>

    <div
        v-else
        class="text-gray-700 text-center py-20 border border-gray-200 rounded-2xl bg-gray-50"
    >
        <h2 class="text-xl font-semibold text-gray-800 mb-2">
            ¡Tu solicitud fue enviada correctamente!
        </h2>

        <p class="text-gray-700">
            Te daremos una respuesta al reclamo en una plazo no mayor a 15 días calendarios.
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { post } from "../lib/api";
import JdInput from "./JdInput.vue";
import JdTextArea from "./JdTextArea.vue";
import JdSelect from "./JdSelect.vue";
import JdCheckBox from "./JdCheckBox.vue";
import JdRadio from "./JdRadio.vue";
import JdButton from "./JdButton.vue";

export default defineComponent({
    components: {
        JdInput,
        JdTextArea,
        JdSelect,
        JdCheckBox,
        JdRadio,
        JdButton,
    },
    props: {
        identity_documents: { type: Array, default: () => [] },
    },
    data() {
        return {
            loading: false,
            enviado: false,
            resMsg: "",

            form: {},
            errors: {},

            solicitud_tipos: [
                {
                    id: "reclamo",
                    name: "Reclamo",
                    descripcion:
                        "Es la expresión de disconformidad del consumidor referida a los bienes expendidos o suministrados o a los servicios prestados.",
                },
                {
                    id: "queja",
                    name: "Queja",
                    descripcion:
                        "Es aquella disconformidad que no se encuentra relacionada a los bienes que comercializa el proveedor o a los servicios que presta. Puede expresar el malestar o descontento del consumidor respecto a la atención al público.",
                },
            ],
        };
    },
    methods: {
        validateForm() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ""));

            if (!this.form.first_name) this.errors.first_name = "Campo obligatorio.";
            if (!this.form.last_name) this.errors.last_name = "Campo obligatorio.";
            if (!this.form.document_type) this.errors.document_type = "Seleccione un tipo de documento.";
            if (!this.form.document_number) this.errors.document_number = "Campo obligatorio.";
            if (!this.form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email))
                this.errors.email = "Ingrese un correo válido.";
            if (!this.form.address) this.errors.address = "Campo obligatorio.";

            if (!this.form.order_code) this.errors.order_code = "Campo obligatorio.";
            if (!this.form.amount) this.errors.amount = "Campo obligatorio.";
            if (!this.form.product_description)
                this.errors.product_description = "Campo obligatorio.";

            if (!this.form.claim_type) this.errors.claim_type = "Seleccione un tipo de solicitud.";
            if (!this.form.summary) this.errors.summary = "Resuma su reclamo.";
            if (!this.form.description) this.errors.description = "Describa su solicitud.";

            return Object.values(this.errors).every((e) => !e);
        },
        shapeDatos() {
            this.form.received_date = new Date();
        },
        async enviar() {
            if (!this.validateForm()) return;

            this.shapeDatos();

            this.loading = true;
            const res = await post("libro_reclamos", this.form);
            this.loading = false;

            if (!res.ok) {
                this.errors.general = res.problem.detail;
            } else {
                this.errors.general = res.warnings?.[0]?.detail || '';
                this.enviado = true;

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        },
    },
})
</script>
