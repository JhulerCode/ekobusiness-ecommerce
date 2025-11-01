<template>
    <div class="flex justify-between mb-4">
        <h2 class="text-xl font-semibold">
            {{ headText }}
        </h2>

        <button @click="openModal" class="button button1">Agregar</button>
    </div>

    <div
        v-if="user.pago_metodos && user.pago_metodos.length > 0"
        class="space-y-4"
    >
        <div
            v-for="(dir, i) in user.pago_metodos"
            :key="i"
            class="flex justify-between items-start bg-gray-50 p-4 rounded-xl border border-gray-200"
        >
            <div>
                <p class="font-medium text-gray-800">VISA {{ dir.ultimos4 }}</p>

                <p class="text-sm text-gray-600">
                    {{ doc_tipos.find((t) => t.id == dir.doc_tipo).nombre }} |
                    Expira el {{ dir.vencimiento }}
                    <template v-if="dir.principal">
                        |
                        <span
                            class="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg"
                        >
                            Principal
                        </span>
                    </template>
                </p>
            </div>

            <div class="flex flex-col space-y-2">
                <button
                    @click="openQuestion(i)"
                    title="Eliminar"
                    class="text-sm text-red-500 cursor-pointer"
                >
                    <Trash />
                </button>
                <button
                    v-if="!dir.principal"
                    @click="setPrincipal(i)"
                    title="Marcar como principal"
                    class="text-sm text-gray-700 cursor-pointer"
                >
                    <Star />
                    <LoadingSpin v-if="loadingSetPrincipal" />
                </button>
            </div>
        </div>
    </div>

    <div v-else class="text-gray-600 text-center">
        <p>No tienes medios de pago registrados.</p>
    </div>

    <transition name="fade">
        <div v-if="showAddModal" class="modal">
            <div class="center">
                <header>
                    <h3>Nuevo medio de pago</h3>

                    <button @click="closeModal">
                        <Xmark />
                    </button>
                </header>

                <main>
                    <div class="grid md:grid-cols-2 gap-4">
                        <JdSelect
                            label="Tipo"
                            :nec="true"
                            :lista="doc_tipos"
                            v-model="form.doc_tipo"
                            :error="errors.doc_tipo"
                        />

                        <!-- <JdInput
                            label="Marca"
                            :nec="true"
                            v-model="form.marca"
                            :error="errors.marca"
                        /> -->

                        <JdInput
                            label="Nro de tarjeta"
                            :nec="true"
                            placeholder="0000 0000 0000 0000"
                            maxlength="19"
                            v-model="form.ultimos4"
                            :error="errors.ultimos4"
                            @input="agruparCada4"
                            class="col-span-2"
                        />

                        <JdInput
                            label="Expiración"
                            :nec="true"
                            placeholder="MM/AA"
                            maxlength="5"
                            v-model="form.vencimiento"
                            :error="errors.vencimiento"
                            @input="agruparCada2ConSlash"
                        />

                        <JdInput
                            label="Código de seguridad"
                            :nec="true"
                            placeholder="CVV"
                            maxlength="3"
                            v-model="form.cvv"
                            :error="errors.cvv"
                        />

                        <JdCheckBox
                            label="Principal"
                            v-model="form.principal"
                        />
                    </div>
                </main>

                <footer>
                    <JdButton
                        text="Guardar"
                        :loading="loadingCreate"
                        @click="grabar"
                    />

                    {{ errors.general }}
                </footer>
            </div>
        </div>
    </transition>

    <transition name="fade">
        <div v-if="showQuestion" class="modal">
            <div class="center">
                <main>
                    <p>¿Está seguro de eliminar?</p>
                </main>

                <footer>
                    <JdButton text="NO" tipo="2" @click="closeQuestion" />
                    <JdButton
                        text="SI"
                        :loading="loadingDelete"
                        @click="eliminar"
                    />
                </footer>
            </div>
        </div>
    </transition>
</template>

<script>
import JdInput from '../components/JdInput.vue';
import JdTextArea from '../components/JdTextArea.vue';
import JdSelect from '../components/JdSelect.vue';
import JdSelectQuery from '../components/JdSelectQuery.vue';
import JdCheckBox from '../components/JdCheckBox.vue';
import JdButton from '../components/JdButton.vue';
import Xmark from '../assets/icons/xmark.vue';
import Trash from '../assets/icons/trash.vue';
import Star from '../assets/icons/star.vue';
import LoadingSpin from './LoadingSpin.vue';

import { urls, get, patch } from '../lib/api.js';

export default {
    components: {
        JdInput,
        JdTextArea,
        JdSelect,
        JdSelectQuery,
        JdCheckBox,
        JdButton,
        Xmark,
        Trash,
        Star,
        LoadingSpin,
    },
    props: {
        headText: { type: String, default: '' },
        user: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            showAddModal: false,
            showQuestion: false,

            loadingCreate: false,
            loadingDelete: false,
            loadingSetPrincipal: false,

            form: {},
            errors: {},

            doc_tipos: [
                {
                    id: 'credito',
                    nombre: 'CRÉDITO',
                },
                {
                    id: 'debito',
                    nombre: 'DÉBITO',
                },
            ],
        };
    },
    methods: {
        openModal() {
            this.showAddModal = true;
            document.body.style.overflow = 'hidden'; // evita scroll en fondo
        },
        closeModal() {
            this.showAddModal = false;
            document.body.style.overflow = '';
            this.form = {};
        },
        openQuestion(i) {
            this.showQuestion = true;
            document.body.style.overflow = 'hidden'; // evita scroll en fondo
            this.toDelete = i;
        },
        closeQuestion() {
            this.showQuestion = false;
            document.body.style.overflow = '';
        },

        agruparCada4() {
            const limpio = this.form.ultimos4.replace(/\s+/g, '');
            this.form.ultimos4 = limpio.replace(/(.{4})/g, '$1 ').trim();
        },
        agruparCada2ConSlash() {
            const limpio = this.form.vencimiento.replace(/\//g, '');
            this.form.vencimiento = limpio
                .replace(/(.{2})/g, '$1/')
                .replace(/\/$/, '');
        },

        validateForm() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

            // if (!this.form.nombre)
            //     this.errors.nombre = 'Este campo es obligatorio.';
            // if (!this.form.direccion)
            //     this.errors.direccion = 'Este campo es obligatorio.';
            // if (!this.form.distrito)
            //     this.errors.distrito = 'Este campo es obligatorio.';
            // if (!this.form.referencia)
            //     this.errors.referencia = 'Este campo es obligatorio.';

            return Object.values(this.errors).every((e) => !e);
        },
        shapeDatos(pago_metodos) {
            return {
                id: this.user.id,
                pago_metodos,
                tipo: 2,
                comes_from: 'ecommerce',
                user_token: localStorage.getItem('token'),
            };
        },
        async grabar() {
            if (this.loadingCreate) return;
            if (!this.validateForm()) return;

            const pago_metodos = JSON.parse(
                JSON.stringify(this.user.pago_metodos)
            );
            if (this.form.principal == true) {
                pago_metodos.forEach((d) => (d.principal = false));
            }
            pago_metodos.push({ ...this.form });

            const send = this.shapeDatos(pago_metodos);

            this.loadingCreate = true;
            const res = await patch('account', send);
            this.loadingCreate = false;

            if (res.code == 0) {
                this.closeModal();
                this.user.pago_metodos = res.data.pago_metodos;
            } else {
                this.errors.general = res.msg;
            }
        },
        async eliminar() {
            const pago_metodos = JSON.parse(
                JSON.stringify(this.user.pago_metodos)
            );
            pago_metodos.splice(this.toDelete, 1);

            const send = this.shapeDatos(pago_metodos);

            this.loadingDelete = true;
            const res = await patch('account', send);
            this.loadingDelete = false;

            if (res.code == 0) {
                this.user.pago_metodos = res.data.pago_metodos;
                this.closeQuestion();
            }
        },
        async setPrincipal(i) {
            const pago_metodos = JSON.parse(
                JSON.stringify(this.user.pago_metodos)
            );
            pago_metodos.forEach((d) => (d.principal = false));
            pago_metodos[i].principal = true;

            const send = this.shapeDatos(pago_metodos);

            this.loadingSetPrincipal = true;
            const res = await patch('account', send);
            this.loadingSetPrincipal = false;

            if (res.code == 0) {
                this.user.pago_metodos = res.data.pago_metodos;
            }
        },
    },
};
</script>
