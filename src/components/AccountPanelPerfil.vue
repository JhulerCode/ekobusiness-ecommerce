<template>
    <div>
        <div class="mb-8 flex flex-col gap-5 border-b border-sunka-sand pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-sunka-brass">
                    Información personal
                </p>
                <h2 class="mt-2 font-heading text-2xl font-semibold text-sunka-forest">
                    {{ headText }}
                </h2>
                <p class="mt-1 text-sm text-sunka-stone">Mantén actualizados tus datos de contacto.</p>
            </div>

            <div class="flex flex-wrap gap-2">
                <JdButton
                    :text="editing ? 'Cancelar' : 'Editar'"
                    :tipo="editing ? 2 : 1"
                    @click="editing = !editing"
                    class="!h-10 !rounded-none !border-sunka-ink !px-5 !py-2 text-[10px] font-semibold uppercase tracking-[0.14em]"
                />

                <JdButton
                    v-if="editing"
                    text="Guardar cambios"
                    :loading="loading"
                    @click="actualizar"
                    class="!h-10 !rounded-none !border-sunka-ink !bg-sunka-ink !px-5 !py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sunka-white"
                />
            </div>
        </div>

        <div class="grid gap-5 md:grid-cols-2 md:gap-x-7 md:gap-y-6">
            <JdInput label="Nombres" v-model="user.nombres" :disabled="!editing" />

            <JdSelect
                label="Tipo de documento"
                :lista="documentos_identidad"
                v-model="user.doc_tipo"
                :disabled="!editing"
            />

            <JdInput label="Número de documento" v-model="user.doc_numero" :disabled="!editing" />

            <JdInput label="Teléfono" v-model="user.telefono1" :disabled="!editing" />

            <div>
                <JdInput label="Correo" v-model="user.correo" :disabled="true" />

                <p class="mt-2 text-xs leading-relaxed text-sunka-stone" v-if="editing">
                    Por tu seguridad, no es posible cambiar tu correo. Si quieres usar otro, crea
                    una nueva cuenta.
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import JdInput from '../components/JdInput.vue'
import JdSelect from '../components/JdSelect.vue'
import JdLoading from '../components/LoadingSpin.vue'
import JdButton from '../components/JdButton.vue'
import { urls, get, patch } from '../lib/api'

export default defineComponent({
    components: {
        JdInput,
        JdSelect,
        JdLoading,
        JdButton,
    },
    props: {
        headText: { type: String, default: '' },
        user: { type: Object, default: () => ({}) },
        documentos_identidad: { type: Array, default: () => [] },
    },
    data() {
        return {
            editing: false,
            loading: false,
            errors: {},
        }
    },
    methods: {
        // validateForm() {
        //     Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

        //     if (!this.form.correo)
        //         this.errors.correo = 'Este campo es obligatorio.';

        //     return Object.values(this.errors).every((e) => !e);
        // },
        shapeDatos() {
            const { id, nombres, doc_tipo, doc_numero, telefono1 } = this.user

            return {
                id,
                nombres,
                doc_tipo,
                doc_numero,
                telefono1,
                tipo: 2,
                comes_from: 'ecommerce',
            }
        },
        async actualizar() {
            if (this.loading) return
            // if (!this.validateForm()) return;

            const send = this.shapeDatos()

            this.loading = true
            const res = await patch('account', send)
            this.loading = false

            if (res.ok) {
                this.editing = false
            }
        },
    },
})
</script>
