<template>
    <div class="space-y-8" v-if="!enviado">
        <!-- Datos personales -->
        <div>
            <h2 class="text-lg font-medium mb-4 text-neutral-900">
                Datos personales
            </h2>

            <div class="grid md:grid-cols-2 gap-4">
                <JdInput
                    label="Nombres"
                    :nec="true"
                    v-model="form.nombres"
                    :error="errors.nombres"
                />

                <JdInput
                    label="Apellidos"
                    :nec="true"
                    v-model="form.apellidos"
                    :error="errors.apellidos"
                />

                <JdSelect
                    label="Tipo de documento"
                    :nec="true"
                    :lista="doc_tipos"
                    v-model="form.doc_tipo"
                    :error="errors.doc_tipo"
                />

                <JdInput
                    label="Nro de documento"
                    :nec="true"
                    v-model="form.doc_numero"
                    :error="errors.doc_numero"
                />

                <JdInput
                    label="Correo"
                    :nec="true"
                    v-model="form.correo"
                    :error="errors.correo"
                />

                <JdInput
                    label="Dirección"
                    :nec="true"
                    v-model="form.direccion"
                    :error="errors.direccion"
                />

                <JdCheckBox
                    label="Soy menor de edad"
                    v-model="form.menor_edad"
                />
            </div>
        </div>

        <!-- Pedido -->
        <div>
            <h2 class="text-lg font-medium mb-4 text-neutral-900">
                Datos del representante del titular (si aplica)
            </h2>

            <p class="text-sm text-gray-600 mb-4">
                Estos datos nos ayudarán a resolver tu reclamo de manera más
                rápida.
            </p>

            <div class="grid md:grid-cols-2 gap-4">
                <JdInput
                    label="Nro de pedido"
                    :nec="true"
                    v-model="form.pedido_codigo"
                    :error="errors.pedido_codigo"
                />

                <JdInput
                    label="Monto reclamado en soles"
                    :nec="true"
                    type="number"
                    v-model="form.monto"
                    :error="errors.monto"
                />

                <JdTextArea
                    label="Descripción del producto"
                    :nec="true"
                    v-model="form.producto_descripcion"
                    :error="errors.producto_descripcion"
                    class="md:col-span-2"
                />
            </div>
        </div>

        <!-- Detalles -->
        <div>
            <h2 class="text-lg font-medium mb-4 text-neutral-900">
                Detalles de la solicitud
            </h2>

            <div class="grid gap-4">
                <JdRadio
                    label="Tipo"
                    :nec="true"
                    :lista="solicitud_tipos"
                    v-model="form.tipo"
                    :error="errors.tipo"
                    :with-border="true"
                />

                <JdTextArea
                    label="Resumen de tu reclamo"
                    :nec="true"
                    v-model="form.resumen"
                    :error="errors.resumen"
                />

                <JdTextArea
                    label="Detalle de tu solicitud"
                    :nec="true"
                    v-model="form.detalle"
                    :error="errors.detalle"
                />
            </div>
        </div>

        <div class="flex flex-col items-center">
            <JdButton
                text="Enviar"
                @click="enviar"
                :loading="loading"
                class="!w-60"
            />

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
            Te daremos una respuesta al reclamo en una plazo no mayor a 15 días
            calendarios.
        </p>
    </div>
</template>

<script>
import { post } from '../lib/api.js';
import JdInput from './JdInput.vue';
import JdTextArea from './JdTextArea.vue';
import JdSelect from './JdSelect.vue';
import JdCheckBox from './JdCheckBox.vue';
import JdRadio from './JdRadio.vue';
import JdButton from './JdButton.vue';

export default {
    components: {
        JdInput,
        JdTextArea,
        JdSelect,
        JdCheckBox,
        JdRadio,
        JdButton,
    },
    data() {
        return {
            loading: false,
            enviado: false,
            resMsg: '',

            form: {},
            errors: {},

            solicitud_tipos: [
                {
                    id: 'reclamo',
                    nombre: 'Reclamo',
                    descripcion:
                        'Es la expresión de disconformidad del consumidor referida a los bienes expendidos o suministrados o a los servicios prestados.',
                },
                {
                    id: 'queja',
                    nombre: 'Queja',
                    descripcion:
                        'Es aquella disconformidad que no se encuentra relacionada a los bienes que comercializa el proveedor o a los servicios que presta. Puede expresar el malestar o descontento del consumidor respecto a la atención al público.',
                },
            ],
            doc_tipos: [
                {
                    id: 'DNI',
                    nombre: 'DNI',
                },
                {
                    id: 'CE',
                    nombre: 'Carné de Extranjería',
                },
                {
                    id: 'PAS',
                    nombre: 'Pasaporte',
                },
            ],
        };
    },
    methods: {
        validateForm() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

            if (!this.form.nombres) this.errors.nombres = 'Campo obligatorio.';
            if (!this.form.apellidos)
                this.errors.apellidos = 'Campo obligatorio.';
            if (!this.form.doc_tipo)
                this.errors.doc_tipo = 'Seleccione un tipo de documento.';
            if (!this.form.doc_numero)
                this.errors.doc_numero = 'Campo obligatorio.';
            if (
                !this.form.correo ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.correo)
            )
                this.errors.correo = 'Ingrese un correo válido.';
            if (!this.form.direccion)
                this.errors.direccion = 'Campo obligatorio.';

            if (!this.form.pedido_codigo)
                this.errors.pedido_codigo = 'Campo obligatorio.';
            if (!this.form.monto) this.errors.monto = 'Campo obligatorio.';
            if (!this.form.producto_descripcion)
                this.errors.producto_descripcion = 'Campo obligatorio.';

            if (!this.form.tipo)
                this.errors.tipo = 'Seleccione un tipo de solicitud.';
            if (!this.form.resumen) this.errors.resumen = 'Resuma su reclamo.';
            if (!this.form.detalle)
                this.errors.detalle = 'Describa su solicitud.';

            return Object.values(this.errors).every((e) => !e);
        },
        shapeDatos() {
            this.form.fecha_recepcion = new Date();
        },
        async enviar() {
            if (!this.validateForm()) return;

            this.shapeDatos();

            this.loading = true;
            const res = await post('libro_reclamos', this.form);
            this.loading = false;

            if (res.code < 0) {
                this.errors.general = 'Algo salió mal';
            } else if (res.code > 0) {
                this.errors.general = res.msg;
            }
            if (res.code == 0) {
                this.enviado = true;

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        },
    },
};
</script>
