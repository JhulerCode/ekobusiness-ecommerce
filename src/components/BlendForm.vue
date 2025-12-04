<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <!-- COLUMNA IZQUIERDA -->
        <section class="md:col-span-2 space-y-6">
            <div class="flex gap-6">
                <!-- FORMATO -->
                <div
                    class="flex-1 border border-gray-200 shadow-sm bg-white rounded-2xl p-5 space-y-4"
                >
                    <h2 class="text-xl font-semibold">Formato</h2>
                    <JdRadio
                        :lista="formatos"
                        v-model="blend.formato"
                        :with-border="true"
                        @change="setFormato"
                    />
                </div>

                <!-- EMPAQUE -->
                <div
                    class="flex-1 border border-gray-200 shadow-sm bg-white rounded-2xl p-5 space-y-4"
                >
                    <h2 class="text-xl font-semibold">Empaque</h2>

                    <JdRadio
                        :lista="empaques"
                        v-model="blend.empaque"
                        :with-border="true"
                        @change="setEmpaque"
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
                            blend.hierbaBase === item.id ? 'bg-white text-gray-800' : '',
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
                        v-for="item in complementos"
                        :key="item.id"
                        @click="toggleComplemento(item)"
                        :class="[
                            'p-2 rounded-md border text-center text-sm text-gray-600 border-gray-300 cursor-pointer bg-gray-100 hover:bg-white',
                            blend.complementos?.some((a) => a.id === item.id)
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
                            blend.frutas?.some((a) => a.id === item.id)
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
                            blend.especias?.some((a) => a.id === item.id)
                                ? 'bg-white text-gray-800'
                                : '',
                        ]"
                    >
                        {{ item.nombre }}
                    </button>
                </div>
            </div>

            <p class="text-gray-400 text-sm">
                Para seleccionar un ítem, haz clic en el recuadro correspondiente; para quitarlo,
                vuelve a hacer clic en el mismo recuadro.
            </p>
        </section>

        <!-- COLUMNA DERECHA: RESUMEN -->
        <section
            class="border border-gray-200 shadow-sm bg-white rounded-2xl p-5 h-fit sticky top-20"
        >
            <h2 class="text-xl font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-3">
                Resumen
            </h2>

            <div class="space-y-4">
                <!-- EMPAQUE Y FORMATO -->
                <div>
                    <p class="flex items-center gap-1 text-sm text-gray-400">
                        <PackageIcon class="w-5" />
                        <span>Formato y empaque:</span>
                    </p>

                    <p class="text-gray-400 text-xs mx-6" v-if="!blend.formato1">
                        Seleccione alguno de la lista.
                    </p>

                    <p class="mx-6" v-if="blend.formato1">
                        {{ formatos.find((a) => a.id == blend.formato)?.nombre }}
                        {{
                            blend.empaque1
                                ? "- " + empaques.find((a) => a.id == blend.empaque)?.nombre
                                : null
                        }}
                    </p>
                </div>

                <!-- HIERBA BASE -->
                <div>
                    <p class="flex items-center gap-1 text-sm text-gray-400">
                        <LeafIcon class="w-5" />
                        <span>Hierba base:</span>
                    </p>

                    <p class="text-gray-400 text-xs mx-6" v-if="!blend.hierbaBase1">
                        Seleccione alguno de la lista.
                    </p>

                    <div v-if="blend.hierbaBase1" class="mx-6">
                        <p class="flex justify-between">
                            <span>
                                {{
                                    hierbasBase.find((a) => a.id == blend.hierbaBase)?.nombre || "-"
                                }}
                            </span>
                            <span> {{ blend.hierbaBase1.cantidad || 0 }}g </span>
                        </p>

                        <JdInputRange
                            :number_min="pesoMaximo * 0.4"
                            :number_max="pesoMaximo * 0.6"
                            v-model="blend.hierbaBase1.cantidad"
                            @change="Blend.save(this.blend)"
                        />
                    </div>
                </div>

                <!-- COMPLEMENTOS -->
                <div>
                    <p class="flex items-center gap-1 text-sm text-gray-400">
                        <LeafOtonoIcon class="w-5" />
                        <span>Complementos:</span>
                    </p>

                    <p class="text-gray-400 text-xs mx-6" v-if="blend.complementos?.length == 0">
                        Seleccione alguno de la lista.
                    </p>

                    <div v-for="item in blend.complementos" :key="item.id" class="mx-6">
                        <p class="flex justify-between group">
                            <span class="flex items-center gap-1">
                                {{ item.nombre }}

                                <XmarkIcon
                                    @click="toggleComplemento(item)"
                                    class="w-4 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100"
                                />
                            </span>

                            <span>{{ item.cantidad }}g</span>
                        </p>

                        <JdInputRange
                            number_min="5"
                            :number_max="pesoMaximo * 0.6"
                            v-model="item.cantidad"
                            @change="Blend.save(this.blend)"
                        />
                    </div>
                </div>

                <!-- FRUTAS -->
                <div>
                    <p class="flex items-center gap-1 text-sm text-gray-400">
                        <AppleIcon class="w-5" />
                        <span>Frutas:</span>
                    </p>

                    <p class="text-gray-400 text-xs mx-6" v-if="blend.frutas?.length == 0">
                        Seleccione alguno de la lista.
                    </p>

                    <div v-for="item in blend.frutas" :key="item.id" class="mx-6">
                        <p class="flex justify-between group">
                            <span class="flex items-center gap-1">
                                {{ item.nombre }}

                                <XmarkIcon
                                    @click="toggleFruta(item)"
                                    class="w-4 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100"
                                />
                            </span>

                            <span>{{ item.cantidad }}g</span>
                        </p>

                        <JdInputRange
                            number_min="5"
                            :number_max="pesoMaximo * 0.6"
                            v-model="item.cantidad"
                            @change="Blend.save(this.blend)"
                        />
                    </div>
                </div>

                <!-- ESPECIAS -->
                <div>
                    <p class="flex items-center gap-1 text-sm text-gray-400">
                        <PepperIcon class="w-5" />
                        <span>Especias:</span>
                    </p>

                    <p class="text-gray-400 text-xs mx-6" v-if="blend.especias?.length == 0">
                        Seleccione alguno de la lista.
                    </p>

                    <div v-for="item in blend.especias" :key="item.id" class="mx-6">
                        <p class="flex justify-between group">
                            <span class="flex items-center gap-1">
                                {{ item.nombre }}

                                <XmarkIcon
                                    @click="toggleEspecia(item)"
                                    class="w-4 cursor-pointer text-red-500 opacity-0 group-hover:opacity-100"
                                />
                            </span>

                            <span>{{ item.cantidad }}g</span>
                        </p>

                        <JdInputRange
                            number_min="2"
                            :number_max="pesoMaximo * 0.6"
                            v-model="item.cantidad"
                            @change="Blend.save(this.blend)"
                        />
                    </div>
                </div>
            </div>

            <!-- COSTO TOTAL -->
            <div class="text-gray-900 mt-6 border-t border-gray-300 pt-4">
                <div class="flex justify-between text-md">
                    <span>Peso</span>
                    <small>{{ pesoTotal }}g</small>
                </div>

                <div class="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>S/ {{ redondear(costoTotal) }}</span>
                </div>
            </div>

            <JdButton
                text="Mezclar y añadir al carrito"
                @click="finalizarBlend"
                class="!w-full mt-6"
            />
            <p class="input-error">{{ errors.general }}</p>
        </section>
    </div>

    <transition name="fade">
        <div
            v-if="showToast"
            class="fixed top-12 right-15 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg text-sm flex items-center gap-3 z-50"
        >
            Producto agregado al carrito
        </div>
    </transition>
</template>

<script>
import { Blend } from "../lib/blend.js";
import { Cart } from "../lib/cart.js";

import JdRadio from "../components/JdRadio.vue";
import JdInputRange from "../components/JdInputRange.vue";
import JdButton from "../components/JdButton.vue";

import PackageIcon from "../assets/icons/package.vue";
import LeafIcon from "../assets/icons/leaf.vue";
import LeafOtonoIcon from "../assets/icons/leaf-otono.vue";
import AppleIcon from "../assets/icons/apple.vue";
import PepperIcon from "../assets/icons/pepper.vue";
import XmarkIcon from "../assets/icons/xmark.vue";
import { redondear } from "../lib/mine.js";

export default {
    name: "BlendForm",
    components: {
        JdRadio,
        JdButton,
        JdInputRange,
        PackageIcon,
        LeafIcon,
        LeafOtonoIcon,
        AppleIcon,
        PepperIcon,
        XmarkIcon,
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
        complementos: {
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
                // empaque: 1,
                // formato: 1,
                // hierbaBase: null,
                // complementos: [],
                // frutas: [],
                // especias: [],
            },
            errors: {},
            Blend,
            redondear,
            showToast: false,
            timeOutCloseToast: null,
        };
    },
    computed: {
        pesoMaximo() {
            return this.formatos.find((a) => a.id == this.blend.formato)?.contenido_neto || 50;
        },
        pesoTotal() {
            let pesoFinal = 0;

            pesoFinal += this.blend.hierbaBase1 ? Number(this.blend.hierbaBase1.cantidad) : 0;

            for (const a of this.blend.complementos || []) {
                pesoFinal += Number(a.cantidad);
            }

            for (const a of this.blend.frutas || []) {
                pesoFinal += Number(a.cantidad);
            }

            for (const a of this.blend.especias || []) {
                pesoFinal += Number(a.cantidad);
            }

            return pesoFinal;
        },
        costoTotal() {
            let costoFinal = 0;

            costoFinal += this.blend.empaque1 ? this.blend.empaque1.precio : 0;

            costoFinal += this.blend.hierbaBase
                ? (Number(this.blend.hierbaBase1.cantidad) * this.blend.hierbaBase1.precio) / 1000
                : 0;

            for (const a of this.blend.complementos || []) {
                costoFinal += (Number(a.cantidad) * a.precio) / 1000;
            }

            for (const a of this.blend.frutas || []) {
                costoFinal += (Number(a.cantidad) * a.precio) / 1000;
            }

            for (const a of this.blend.especias || []) {
                costoFinal += (Number(a.cantidad) * a.precio) / 1000;
            }

            return costoFinal * 1.18;
        },
    },
    mounted() {
        this.load();

        window.addEventListener("blend-updated", (ev) => {
            this.blend = ev.detail || Blend.get();
        });
    },
    methods: {
        load() {
            this.blend = Blend.updatePrices(
                this.hierbasBase,
                this.complementos,
                this.frutas,
                this.especias
            );

            this.blend.empaque1 = this.empaques.find((a) => a.id == this.blend.empaque);
            this.blend.formato1 = this.formatos.find((a) => a.id == this.blend.formato);

            // if (!this.blend.hierbaBase) {
            //     this.setHierbaBase(this.hierbasBase[0]);
            // }
        },

        setEmpaque() {
            const i = this.empaques.findIndex((a) => a.id === this.blend.empaque);
            this.blend.empaque1 = this.empaques[i];

            Blend.save(this.blend);
        },
        setFormato() {
            const i = this.formatos.findIndex((a) => a.id === this.blend.formato);
            this.blend.formato1 = this.formatos[i];

            if (this.blend.hierbaBase1) {
                this.blend.hierbaBase1.cantidad = this.pesoMaximo * 0.4;
            }

            for (const a of this.blend.complementos) {
                a.cantidad = this.pesoMaximo * 0.3;
            }

            for (const a of this.blend.frutas) {
                a.cantidad = this.pesoMaximo * 0.2;
            }

            for (const a of this.blend.especias) {
                a.cantidad = this.pesoMaximo * 0.1;
            }

            Blend.save(this.blend);
        },
        setHierbaBase(item) {
            this.blend.hierbaBase = item.id;
            this.blend.hierbaBase1 = { ...item, cantidad: this.pesoMaximo * 0.4 };

            Blend.save(this.blend);
        },

        toggleComplemento(item) {
            const i = this.blend.complementos.findIndex((a) => a.id === item.id);
            if (i !== -1) this.blend.complementos.splice(i, 1);
            else this.blend.complementos.push({ ...item, cantidad: 10 });

            Blend.save(this.blend);
        },
        toggleFruta(item) {
            const i = this.blend.frutas.findIndex((a) => a.id === item.id);
            if (i !== -1) this.blend.frutas.splice(i, 1);
            else this.blend.frutas.push({ ...item, cantidad: 10 });

            Blend.save(this.blend);
        },
        toggleEspecia(item) {
            const i = this.blend.especias.findIndex((a) => a.id === item.id);
            if (i !== -1) this.blend.especias.splice(i, 1);
            else this.blend.especias.push({ ...item, cantidad: 5 });

            Blend.save(this.blend);
        },

        checkDatos() {
            if (this.pesoMaximo != this.pesoTotal) {
                this.errors.general = "Peso incorrecto";
                return true;
            }

            return false;
        },
        finalizarBlend() {
            if (this.checkDatos()) return;

            this.errors.general = "";
            const send = {
                ...this.blend.formato1,
                blend_datos: { ...this.blend },
                cantidad: 1,
                precio: this.costoTotal.toFixed(2),
            };

            Cart.add(send);
            clearTimeout(this.timeOutCloseToast);
            this.showToast = true;

            this.timeOutCloseToast = setTimeout(() => {
                this.showToast = false;
            }, 2500);

            Blend.clear();
            this.blend = Blend.get();

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        },
    },
};
</script>
