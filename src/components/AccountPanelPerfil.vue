<template>
    <div>
        <div class="flex justify-between mb-4">
            <h2 class="text-xl font-semibold">
                {{ headText }}
            </h2>

            <div class="flex gap-2">
                <JdButton
                    :text="editing ? 'Cancelar' : 'Editar'"
                    :tipo="editing ? 2 : 1"
                    @click="editing = !editing"
                />

                <JdButton
                    text="Actualizar"
                    :loading="loading"
                    @click="actualizar"
                    v-if="editing"
                />
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
            <JdInput
                label="Nombres"
                v-model="user.nombres"
                :disabled="!editing"
            />

            <JdInput
                label="Apellidos"
                v-model="user.apellidos"
                :disabled="!editing"
            />

            <JdSelect
                label="Tipo de documento"
                :lista="doc_tipos"
                v-model="user.doc_tipo"
                :disabled="!editing"
            />

            <JdInput
                label="Número de documento"
                v-model="user.doc_numero"
                :disabled="!editing"
            />

            <JdInput
                label="Teléfono"
                v-model="user.telefono1"
                :disabled="!editing"
            />

            <div>
                <JdInput
                    label="Correo"
                    v-model="user.correo"
                    :disabled="true"
                />

                <p class="text-xs text-gray-400 mt-2" v-if="editing">
                    Por tu seguridad, no es posible cambiar tu correo. Si
                    quieres usar otro, crea una nueva cuenta.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import JdInput from '../components/JdInput.vue';
import JdSelect from '../components/JdSelect.vue';
import JdLoading from '../components/LoadingSpin.vue';
import JdButton from '../components/JdButton.vue';
import { urls, get, patch } from '../lib/api.js';

export default {
    components: {
        JdInput,
        JdSelect,
        JdLoading,
        JdButton,
    },
    props: {
        headText: { type: String, default: '' },
        user: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            editing: false,
            loading: false,
            errors: {},
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
        // validateForm() {
        //     Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

        //     if (!this.form.correo)
        //         this.errors.correo = 'Este campo es obligatorio.';

        //     return Object.values(this.errors).every((e) => !e);
        // },
        shapeDatos() {
            const { id, nombres, apellidos, doc_tipo, doc_numero, telefono1 } =
                this.user;

            return {
                id,
                nombres,
                apellidos,
                doc_tipo,
                doc_numero,
                telefono1,
                tipo: 2,
                comes_from: 'ecommerce',
                user_token: localStorage.getItem('token'),
            };
        },
        async actualizar() {
            if (this.loading) return;
            // if (!this.validateForm()) return;

            const send = this.shapeDatos();

            this.loading = true;
            const res = await patch('account', send);
            this.loading = false;

            if (res.code == 0) {
                this.editing = false;
            }
        },
    },
};
</script>
