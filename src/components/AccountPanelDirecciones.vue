<template>
    <div>
        <div class="flex justify-between mb-4">
            <h2 class="text-xl font-semibold">
                {{ headText }}
            </h2>

            <button @click="openModal" class="button">Agregar</button>
        </div>

        <div
            v-if="user.direcciones && user.direcciones.length > 0"
            class="space-y-4"
        >
            <div
                v-for="(dir, i) in user.direcciones"
                :key="i"
                class="flex justify-between items-start bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200"
            >
                <div>
                    <p class="font-medium text-gray-800">
                        {{ dir.nombre }}
                    </p>

                    <p class="text-sm text-gray-600">
                        {{ dir.direccion }}
                        <template v-if="dir.numero">
                            Nro: {{ dir.numero }}
                        </template>
                        <template v-if="dir.piso">
                            Piso: {{ dir.piso }}
                        </template>
                    </p>

                    <p class="text-sm text-gray-600" v-if="dir.ubigeo1">
                        {{ dir.ubigeo1.distrito }}, {{ dir.ubigeo1.provincia }},
                        {{ dir.ubigeo1.departamento }}
                    </p>

                    <p class="text-sm text-gray-600">
                        Referencia: {{ dir.referencia }}
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
            <p>No tienes direcciones registradas.</p>
        </div>
    </div>

    <!-- Modal simple para agregar dirección -->
    <transition name="fade">
        <div v-if="showAddModal" class="modal">
            <div class="center">
                <header>
                    <h3>Nueva dirección</h3>

                    <button @click="closeModal">
                        <Xmark />
                    </button>
                </header>

                <main>
                    <div class="grid md:grid-cols-2 gap-4">
                        <JdInput
                            label="Nombre"
                            placeholder="Ej. Casa, Trabajo"
                            :nec="true"
                            v-model="form.nombre"
                            :error="errors.nombre"
                        />

                        <JdInput
                            label="Dirección"
                            :nec="true"
                            v-model="form.direccion"
                            :error="errors.direccion"
                            class="col-span-2"
                        />

                        <JdInput
                            label="Número"
                            v-model="form.numero"
                            :error="errors.numero"
                        />

                        <JdInput
                            label="Piso / Dpto"
                            v-model="form.piso"
                            :error="errors.piso"
                        />

                        <JdSelectQuery
                            label="Distrito"
                            :nec="true"
                            v-model="form.distrito"
                            :spin="ubigeosLoading"
                            :lista="ubigeos"
                            @search="loadUbigeos"
                            @elegir="setUbigeo"
                            :error="errors.distrito"
                            class="col-span-2"
                        />

                        <JdTextArea
                            label="Referencia"
                            :nec="true"
                            v-model="form.referencia"
                            :error="errors.referencia"
                            class="col-span-2"
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
            ubigeos: [],
            ubigeosLoading: false,
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

        async loadUbigeos(txtBuscar) {
            if (!txtBuscar) {
                this.ubigeos.length = 0;
                return;
            }

            const qry = {
                fltr: {
                    distrito: { op: 'Contiene', val: txtBuscar },
                },
                cols: ['departamento', 'provincia', 'distrito', 'nombre'],
            };

            this.ubigeosLoading = true;
            const res = await get(
                'ubigeos',
                { qry },
                localStorage.getItem('token')
            );
            this.ubigeosLoading = false;

            if (res.code !== 0) return;

            this.ubigeos = res.data;
        },
        setUbigeo(item) {
            this.form.ubigeo1 = item;
        },

        validateForm() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

            if (!this.form.nombre)
                this.errors.nombre = 'Este campo es obligatorio.';
            if (!this.form.direccion)
                this.errors.direccion = 'Este campo es obligatorio.';
            if (!this.form.distrito)
                this.errors.distrito = 'Este campo es obligatorio.';
            if (!this.form.referencia)
                this.errors.referencia = 'Este campo es obligatorio.';

            return Object.values(this.errors).every((e) => !e);
        },
        shapeDatos(direcciones) {
            return {
                id: this.user.id,
                direcciones,
                tipo: 2,
                comes_from: 'ecommerce',
                user_token: localStorage.getItem('token'),
            };
        },
        async grabar() {
            if (this.loadingCreate) return;
            if (!this.validateForm()) return;

            const direcciones = JSON.parse(
                JSON.stringify(this.user.direcciones)
            );
            if (this.form.principal == true) {
                direcciones.forEach((d) => (d.principal = false));
            }
            direcciones.push({ ...this.form });

            const send = this.shapeDatos(direcciones);

            this.loadingCreate = true;
            const res = await patch('account', send);
            this.loadingCreate = false;

            if (res.code == 0) {
                this.closeModal();
                this.user.direcciones = res.data.direcciones;
            }
        },
        async eliminar() {
            const direcciones = JSON.parse(
                JSON.stringify(this.user.direcciones)
            );
            direcciones.splice(this.toDelete, 1);

            const send = this.shapeDatos(direcciones);

            this.loadingDelete = true;
            const res = await patch('account', send);
            this.loadingDelete = false;

            if (res.code == 0) {
                this.user.direcciones = res.data.direcciones;
                this.closeQuestion();
            }
        },
        async setPrincipal(i) {
            const direcciones = JSON.parse(
                JSON.stringify(this.user.direcciones)
            );
            direcciones.forEach((d) => (d.principal = false));
            direcciones[i].principal = true;

            const send = this.shapeDatos(direcciones);

            this.loadingSetPrincipal = true;
            const res = await patch('account', send);
            this.loadingSetPrincipal = false;

            if (res.code == 0) {
                this.user.direcciones = res.data.direcciones;
            }
        },
    },
};
</script>
