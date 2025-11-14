<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <!-- COLUMNA IZQUIERDA -->
        <section class="md:col-span-2 space-y-6">
            <div class="flex gap-6">
                <!-- EMPAQUE -->
                <div
                    class="flex-1 border border-gray-200 shadow-sm bg-white rounded-2xl p-5 space-y-4"
                >
                    <h2 class="text-xl font-semibold">Empaque</h2>

                    <JdRadio
                        :lista="empaques"
                        v-model="blend.empaque"
                        :error="errors.empaque"
                        :with-border="true"
                    />
                </div>

                <!-- FORMATO -->
                <div
                    class="flex-1 border border-gray-200 shadow-sm bg-white rounded-2xl p-5 space-y-4"
                >
                    <h2 class="text-xl font-semibold">Formato</h2>
                    <JdRadio
                        :lista="formatos"
                        v-model="blend.formato"
                        :error="errors.formato"
                        :with-border="true"
                    />
                </div>
            </div>

            <!-- HIERBA BASE -->
            <div class="border border-gray-200 shadow-sm bg-white rounded-2xl p-5 space-y-4">
                <div class="flex justify-between">
                    <h2 class="text-xl font-semibold">Hierba base</h2>
                    <span class="text-sm text-gray-400">(mínimo 40%)</span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                        v-for="item in hierbasBase"
                        :key="item.id"
                        @click="setHierbaBase(item)"
                        :class="[
                            'p-2 rounded-md border text-center text-sm text-gray-600 border-gray-300 cursor-pointer bg-gray-100 hover:bg-white',
                            blend.hierbaBase?.id === item.id ? 'bg-white text-gray-800' : '',
                        ]"
                    >
                        {{ item.nombre }}
                    </button>
                </div>
            </div>

            <!-- HIERBAS COMPLEMENTO -->
            <div class="border border-gray-200 shadow-sm bg-white rounded-2xl p-5 space-y-4">
                <h2 class="text-xl font-semibold">Hierbas complemento</h2>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                        v-for="item in hierbasComplemento"
                        :key="item.id"
                        @click="toggleComplemento(item)"
                        :class="[
                            'p-2 rounded-md border text-center text-sm text-gray-600 border-gray-300 cursor-pointer bg-gray-100 hover:bg-white',
                            blend.complementos.some((a) => a.id === item.id)
                                ? 'bg-white text-gray-800'
                                : '',
                        ]"
                    >
                        {{ item.nombre }}
                    </button>
                </div>
            </div>

            <!-- FRUTAS -->
            <div class="border border-gray-200 shadow-sm bg-white rounded-2xl p-5 space-y-4">
                <h2 class="text-xl font-semibold">Frutas deshidratadas</h2>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                        v-for="item in frutas"
                        :key="item.id"
                        @click="toggleFruta(item)"
                        :class="[
                            'p-2 rounded-md border text-center text-sm text-gray-600 border-gray-300 cursor-pointer bg-gray-100 hover:bg-white',
                            blend.frutas.some((a) => a.id === item.id)
                                ? 'bg-white text-gray-800'
                                : '',
                        ]"
                    >
                        {{ item.nombre }}
                    </button>
                </div>
            </div>

            <!-- ESPECIAS -->
            <div class="border border-gray-200 shadow-sm bg-white rounded-2xl p-5 space-y-4">
                <h2 class="text-xl font-semibold">Especias</h2>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                        v-for="item in especias"
                        :key="item.id"
                        @click="toggleEspecia(item)"
                        :class="[
                            'p-2 rounded-md border text-center text-sm text-gray-600 border-gray-300 cursor-pointer bg-gray-100 hover:bg-white',
                            blend.especias.some((a) => a.id === item.id)
                                ? 'bg-white text-gray-800'
                                : '',
                        ]"
                    >
                        {{ item.nombre }}
                    </button>
                </div>
            </div>
        </section>

        <!-- COLUMNA DERECHA: RESUMEN -->
        <section
            class="border border-gray-200 shadow-sm bg-white rounded-2xl p-5 h-fit sticky top-20"
        >
            <h2 class="text-xl font-semibold">Resumen</h2>

            <!-- EMPAQUE Y FORMATO -->
            <div class="space-y-1">
                <p><strong>Empaque:</strong> {{ blend.empaque?.nombre || "—" }}</p>
                <p><strong>Formato:</strong> {{ blend.formato?.nombre || "—" }}</p>
            </div>

            <!-- HIERBA BASE -->
            <div v-if="blend.hierbaBase">
                <p class="font-medium text-gray-900 mb-2">Hierba base (40% – 100%)</p>
                <input type="range" min="40" max="100" v-model="blend.hierbaBase.cantidad" />
                <p class="text-sm text-gray-600 mt-1">{{ blend.hierbaBase.cantidad }}%</p>
            </div>

            <!-- COMPLEMENTOS -->
            <div v-if="blend.complementos.length">
                <p class="font-medium text-gray-900 mb-2">Hierbas complemento</p>

                <div v-for="item in blend.complementos" :key="item.id" class="mb-4">
                    <p>{{ item.nombre }}</p>
                    <input type="range" min="0" max="40" v-model="item.cantidad" />
                    <p class="text-sm text-gray-600">{{ item.cantidad }}%</p>
                </div>
            </div>

            <!-- FRUTAS -->
            <div v-if="blend.frutas.length">
                <p class="font-medium text-gray-900 mb-2">Frutas</p>

                <div v-for="item in blend.frutas" :key="item.id" class="mb-4">
                    <p>{{ item.nombre }}</p>
                    <input type="range" min="0" max="30" v-model="item.cantidad" />
                    <p class="text-sm text-gray-600">{{ item.cantidad }}%</p>
                </div>
            </div>

            <!-- ESPECIAS -->
            <div v-if="blend.especias.length">
                <p class="font-medium text-gray-900 mb-2">Especias</p>

                <div v-for="item in blend.especias" :key="item.id" class="mb-4">
                    <p>{{ item.nombre }}</p>
                    <input type="range" min="0" max="20" v-model="item.cantidad" />
                    <p class="text-sm text-gray-600">{{ item.cantidad }}%</p>
                </div>
            </div>

            <!-- COSTO TOTAL -->
            <div class="pt-4 border-t">
                <p class="text-xl font-semibold text-gray-900">Total: S/ {{ totalBlend }}</p>
            </div>

            <JdButton text="Mezclar y añadir al carrito" @click="finalizarBlend" class="w-full" />
        </section>
    </div>
</template>

<script>
import { Blend } from "../lib/blend.js";
import JdRadio from "../components/JdRadio.vue";
import JdButton from "../components/JdButton.vue";

export default {
    name: "BlendForm",
    components: {
        JdRadio,
        JdButton,
    },
    props: {
        empaques: {
            type: Array,
            default: () => {
                [];
            },
        },
        formatos: {
            type: Array,
            default: () => {
                [];
            },
        },
        hierbasBase: {
            type: Array,
            default: () => {
                [];
            },
        },
        hierbasComplemento: {
            type: Array,
            default: () => {
                [];
            },
        },
        frutas: {
            type: Array,
            default: () => {
                [];
            },
        },
        especias: {
            type: Array,
            default: () => {
                [];
            },
        },
    },

    data() {
        return {
            blend: {
                empaque: null,
                formato: null,
                hierbaBase: null,
                complementos: [],
                frutas: [],
                especias: [],
            },
            errors: {},
        };
    },
    computed: {
        totalBlend() {
            let total = 0;

            if (this.blend.formato?.precio) total += this.blend.formato.precio;
            if (this.blend.empaque?.precio) total += this.blend.empaque.precio;

            const sum = (arr) =>
                arr.reduce((t, a) => t + ((a.precio || 0) * (a.cantidad || 0)) / 100, 0);

            if (this.blend.hierbaBase) {
                total +=
                    ((this.blend.hierbaBase.precio || 0) * this.blend.hierbaBase.cantidad) / 100;
            }

            total += sum(this.blend.complementos);
            total += sum(this.blend.frutas);
            total += sum(this.blend.especias);

            return total.toFixed(2);
        },
    },
    methods: {
        load() {
            this.items = Blend.get();
        },

        setHierbaBase(item) {
            this.blend.hierbaBase = { ...item, cantidad: 40 };
        },

        toggleComplemento(item) {
            const i = this.blend.complementos.findIndex((a) => a.id === item.id);
            if (i >= 0) this.blend.complementos.splice(i, 1);
            else this.blend.complementos.push({ ...item, cantidad: 10 });
        },

        toggleFruta(item) {
            const i = this.blend.frutas.findIndex((a) => a.id === item.id);
            if (i >= 0) this.blend.frutas.splice(i, 1);
            else this.blend.frutas.push({ ...item, cantidad: 10 });
        },

        toggleEspecia(item) {
            const i = this.blend.especias.findIndex((a) => a.id === item.id);
            if (i >= 0) this.blend.especias.splice(i, 1);
            else this.blend.especias.push({ ...item, cantidad: 5 });
        },

        finalizarBlend() {
            console.log("Blend final:", this.blend);
        },
    },

    mounted() {
        this.load();

        window.addEventListener("blend-updated", (ev) => {
            this.blend = ev.detail || Blend.get();
        });
    },
};
</script>
