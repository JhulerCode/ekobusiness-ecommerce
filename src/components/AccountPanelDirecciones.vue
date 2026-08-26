<template>
    <div>
        <div class="mb-8 flex flex-col gap-5 border-b border-sunka-sand pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-sunka-brass">
                    Lugares de entrega
                </p>
                <h2 class="mt-2 font-heading text-2xl font-semibold text-sunka-forest">
                    {{ headText }}
                </h2>
                <p class="mt-1 text-sm text-sunka-stone">Guarda tus direcciones para agilizar tus compras.</p>
            </div>

            <button
                @click="openModal"
                class="h-10 cursor-pointer border border-sunka-ink bg-sunka-ink px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sunka-white transition-colors hover:bg-sunka-forest"
            >
                Agregar dirección
            </button>
        </div>

        <div
            v-if="user.direcciones && user.direcciones.length > 0"
            class="grid gap-4 xl:grid-cols-2"
        >
            <div
                v-for="(dir, i) in user.direcciones"
                :key="i"
                class="flex min-h-44 justify-between gap-5 border border-sunka-sand bg-sunka-white p-5 transition-colors hover:bg-sunka-cream/50 sm:p-6"
            >
                <div class="min-w-0">
                    <div class="mb-3 flex flex-wrap items-center gap-2">
                    <p class="font-heading text-lg font-semibold text-sunka-forest">
                        {{ dir.nombre }}
                    </p>
                    <span
                        v-if="dir.principal"
                        class="border border-sunka-brass/40 bg-sunka-cream px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-sunka-brass"
                    >
                        Principal
                    </span>
                    </div>

                    <p class="text-sm leading-relaxed text-sunka-ink/75">
                        {{ dir.direccion }}
                        <template v-if="dir.numero">
                            Nro: {{ dir.numero }}
                        </template>
                        <template v-if="dir.piso">
                            Piso: {{ dir.piso }}
                        </template>
                    </p>

                    <p class="mt-1 text-sm leading-relaxed text-sunka-stone" v-if="dir.ubigeo1">
                        {{ dir.ubigeo1.distrito }}, {{ dir.ubigeo1.provincia }},
                        {{ dir.ubigeo1.departamento }}
                    </p>

                    <p v-if="dir.referencia" class="mt-3 text-xs leading-relaxed text-sunka-stone">
                        Referencia: {{ dir.referencia }}
                    </p>
                </div>

                <div class="flex shrink-0 flex-col gap-2">
                    <button
                        @click="openQuestion(i)"
                        title="Eliminar"
                        class="flex h-9 w-9 cursor-pointer items-center justify-center border border-sunka-sand text-sunka-stone transition-colors hover:border-[var(--sunka-danger)] hover:text-[var(--sunka-danger)]"
                    >
                        <Trash />
                    </button>
                    <button
                        v-if="!dir.principal"
                        @click="setPrincipal(i)"
                        title="Marcar como principal"
                        class="flex h-9 w-9 cursor-pointer items-center justify-center border border-sunka-sand text-sunka-stone transition-colors hover:border-sunka-brass hover:text-sunka-brass"
                    >
                        <Star />
                        <LoadingSpin v-if="loadingSetPrincipal" />
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="border border-dashed border-sunka-sand bg-sunka-cream/45 px-5 py-12 text-center">
            <p class="font-heading text-lg font-semibold text-sunka-forest">Aún no tienes direcciones</p>
            <p class="mt-1 text-sm text-sunka-stone">Agrega una dirección para tus próximas entregas.</p>
        </div>
    </div>

    <!-- Modal simple para agregar dirección -->
    <Teleport to="body">
        <transition name="fade">
            <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-sunka-ink/70 p-4 backdrop-blur-sm" @click.self="closeModal">
            <div class="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden border border-sunka-sand bg-sunka-white text-sunka-ink shadow-2xl">
                <header class="flex items-start justify-between border-b border-sunka-sand bg-sunka-cream px-6 py-6 sm:px-8">
                    <div>
                        <p class="text-[9px] font-semibold uppercase tracking-[0.22em] text-sunka-brass">Lugares de entrega</p>
                        <h3 class="mt-2 font-heading text-2xl font-semibold text-sunka-forest">Nueva dirección</h3>
                    </div>

                    <button @click="closeModal" class="flex h-9 w-9 cursor-pointer items-center justify-center border border-sunka-sand text-sunka-stone transition-colors hover:border-sunka-brass hover:text-sunka-ink" aria-label="Cerrar">
                        <Xmark />
                    </button>
                </header>

                <main class="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
                    <div class="grid gap-5 md:grid-cols-2">
                        <JdInput
                            label="Nombre"
                            placeholder="Ej. Casa, Trabajo"
                            :nec="true"
                            v-model="form.nombre"
                            :error="errors.nombre"
                            class="col-span-2 md:col-span-1"
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

                <footer class="flex justify-end border-t border-sunka-sand bg-sunka-cream/50 px-6 py-4 sm:px-8">
                    <JdButton
                        text="Guardar"
                        :loading="loadingCreate"
                        @click="grabar"
                        class="!h-11 !rounded-none !border-sunka-ink !bg-sunka-ink !px-6 !py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sunka-white"
                    />
                </footer>
            </div>
            </div>
        </transition>
    </Teleport>

    <Teleport to="body">
        <transition name="fade">
            <div v-if="showQuestion" class="fixed inset-0 z-[110] flex items-center justify-center bg-sunka-ink/70 p-4 backdrop-blur-sm" @click.self="closeQuestion">
            <div class="w-full max-w-md border border-sunka-sand bg-sunka-white shadow-2xl">
                <main class="px-7 py-8">
                    <p class="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--sunka-danger)]">Confirmar acción</p>
                    <p class="mt-2 font-heading text-xl font-semibold text-sunka-forest">¿Deseas eliminar esta dirección?</p>
                    <p class="mt-2 text-sm text-sunka-stone">Esta acción no se puede deshacer.</p>
                </main>

                <footer class="flex justify-end gap-2 border-t border-sunka-sand bg-sunka-cream/50 px-7 py-4">
                    <JdButton text="Cancelar" tipo="2" @click="closeQuestion" class="!rounded-none !border-sunka-sand" />
                    <JdButton
                        text="Eliminar"
                        :loading="loadingDelete"
                        @click="eliminar"
                        class="!rounded-none !border-[var(--sunka-danger)] !bg-[var(--sunka-danger)] text-sunka-white"
                    />
                </footer>
            </div>
            </div>
        </transition>
    </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import JdInput from '../components/JdInput.vue';
import JdTextArea from '../components/JdTextArea.vue';
import JdSelectQuery from '../components/JdSelectQuery.vue';
import JdCheckBox from '../components/JdCheckBox.vue';
import JdButton from '../components/JdButton.vue';
import Xmark from '../assets/icons/xmark.vue';
import Trash from '../assets/icons/trash.vue';
import Star from '../assets/icons/star.vue';
import LoadingSpin from './LoadingSpin.vue';

import { urls, get, patch } from '../lib/api';
import { genId } from '../lib/mine';

export default defineComponent({
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
                { qry }
            );
            this.ubigeosLoading = false;

            if (!res.ok) return;

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
            direcciones.push({ ...this.form, id: genId() });

            const send = this.shapeDatos(direcciones);

            this.loadingCreate = true;
            const res = await patch('account', send);
            this.loadingCreate = false;

            if (res.ok) {
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

            if (res.ok) {
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

            if (res.ok) {
                this.user.direcciones = res.data.direcciones;
            }
        },
    },
})
</script>
