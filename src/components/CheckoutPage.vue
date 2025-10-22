<template>
    <section class="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
        <!-- Columna izquierda: pasos -->
        <div class="md:col-span-2 space-y-8">
            <!-- Encabezado -->
            <div
                class="flex items-center justify-between mb-10 relative"
                ref="seccionForm1"
            >
                <!-- Paso 1 -->
                <div class="flex flex-col items-center flex-1">
                    <div
                        class="w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300"
                        :class="{
                            'border-black bg-black text-white': step >= 1,
                            'border-gray-300 bg-white text-gray-400': step < 1,
                        }"
                    >
                        1
                    </div>
                    <span
                        class="mt-2 text-sm transition-colors duration-300"
                        :class="{
                            'text-black font-medium': step >= 1,
                            'text-gray-400': step < 1,
                        }"
                    >
                        Identificación
                    </span>
                </div>

                <!-- Línea entre pasos -->
                <div
                    class="flex-1 h-[2px] mx-2 md:mx-4"
                    :class="step > 1 ? 'bg-black' : 'bg-gray-300'"
                ></div>

                <!-- Paso 2 -->
                <div class="flex flex-col items-center flex-1">
                    <div
                        class="w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300"
                        :class="{
                            'border-black bg-black text-white': step >= 2,
                            'border-gray-300 bg-white text-gray-400': step < 2,
                        }"
                    >
                        2
                    </div>
                    <span
                        class="mt-2 text-sm transition-colors duration-300"
                        :class="{
                            'text-black font-medium': step >= 2,
                            'text-gray-400': step < 2,
                        }"
                    >
                        Entrega
                    </span>
                </div>

                <!-- Línea entre pasos -->
                <div
                    class="flex-1 h-[2px] mx-2 md:mx-4"
                    :class="step > 2 ? 'bg-black' : 'bg-gray-300'"
                ></div>

                <!-- Paso 3 -->
                <div class="flex flex-col items-center flex-1">
                    <div
                        class="w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300"
                        :class="{
                            'border-black bg-black text-white': step >= 3,
                            'border-gray-300 bg-white text-gray-400': step < 3,
                        }"
                    >
                        3
                    </div>
                    <span
                        class="mt-2 text-sm transition-colors duration-300"
                        :class="{
                            'text-black font-medium': step >= 3,
                            'text-gray-400': step < 3,
                        }"
                    >
                        Pago
                    </span>
                </div>
            </div>

            <!-- Paso 1: Identificación -->
            <div
                class="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm space-y-6"
            >
                <h2 class="text-xl font-semibold">1. Identificación</h2>

                <!-- Formulario activo -->
                <div v-if="step === 1" class="space-y-6">
                    <p class="text-gray-600">
                        Por favor completa con tu información personal para
                        poder finalizar la compra.
                    </p>

                    <div class="grid md:grid-cols-2 gap-4">
                        <!-- Correo -->
                        <div>
                            <label class="label">Correo*</label>
                            <input
                                v-model="form.email"
                                type="email"
                                class="input"
                            />
                            <p v-if="errors1.email" class="input-error">
                                {{ errors1.email }}
                            </p>
                        </div>

                        <!-- Teléfono -->
                        <div>
                            <label class="label">Teléfono*</label>
                            <input
                                v-model="form.telefono"
                                type="text"
                                class="input"
                            />
                            <p v-if="errors1.telefono" class="input-error">
                                {{ errors1.telefono }}
                            </p>
                        </div>

                        <!-- Nombre -->
                        <div>
                            <label class="label">Nombres*</label>
                            <input
                                v-model="form.nombres"
                                type="text"
                                class="input"
                            />
                            <p v-if="errors1.nombres" class="input-error">
                                {{ errors1.nombres }}
                            </p>
                        </div>

                        <!-- Apellidos -->
                        <div>
                            <label class="label">Apellidos*</label>
                            <input
                                v-model="form.apellidos"
                                type="text"
                                class="input"
                            />
                            <p v-if="errors1.apellidos" class="input-error">
                                {{ errors1.apellidos }}
                            </p>
                        </div>

                        <!-- Tipo de documento -->
                        <div>
                            <label class="label">Tipo de documento*</label>
                            <select v-model="form.doc_tipo" class="input">
                                <option value="DNI">DNI</option>
                                <option value="CE">Carné de Extranjería</option>
                                <option value="PAS">Pasaporte</option>
                            </select>
                            <p v-if="errors1.doc_tipo" class="input-error">
                                {{ errors1.doc_tipo }}
                            </p>
                        </div>

                        <!-- Número de documento -->
                        <div>
                            <label class="label">Número de documento*</label>
                            <input
                                v-model="form.doc_numero"
                                type="text"
                                class="input"
                            />
                            <p v-if="errors1.doc_numero" class="input-error">
                                {{ errors1.doc_numero }}
                            </p>
                        </div>

                        <div class="col-span-2">
                            <label class="checkbox">
                                <input
                                    v-model="form.privacidad"
                                    type="checkbox"
                                />
                                <span>
                                    He leído la
                                    <a
                                        href="/politica-de-privacidad"
                                        target="_blank"
                                        class="underline hover:text-gray-900"
                                    >
                                        Política de Privacidad de SUNKA
                                    </a>
                                    y declaro haber sido informado sobre el
                                    tratamiento de mis datos personales.
                                </span>
                            </label>

                            <p v-if="errors1.privacidad" class="input-error">
                                {{ errors1.privacidad }}
                            </p>
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="flex justify-end">
                        <button @click="continuarEntrega" class="button">
                            Ir a la Entrega <ArrowRight />
                        </button>
                    </div>
                </div>

                <!-- Resumen cuando ya se completó -->
                <div
                    v-else
                    class="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 shadow-inner flex justify-between items-start"
                >
                    <div>
                        <p>
                            <span class="font-medium">Correo:</span>
                            {{ form.email }}
                        </p>
                        <p>
                            <span class="font-medium">Nombre:</span>
                            {{ form.nombres }} {{ form.apellidos }}
                        </p>
                        <p>
                            <span class="font-medium">Teléfono:</span>
                            {{ form.telefono }}
                        </p>
                    </div>

                    <button
                        @click="step = 1"
                        class="text-xs text-blue-600 hover:underline cursor-pointer"
                    >
                        Editar
                    </button>
                </div>
            </div>

            <!-- Paso 2: Entrega -->
            <div
                class="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm space-y-6"
                v-if="step >= 2"
                ref="seccionForm2"
            >
                <h2 class="text-xl font-semibold">2. Entrega</h2>

                <!-- Formulario activo -->
                <div v-if="step === 2" class="space-y-6">
                    <!-- Opciones principales -->
                    <div class="flex gap-4">
                        <label class="radio">
                            <input
                                v-model="form.entrega_tipo"
                                type="radio"
                                value="domicilio"
                            />
                            <span>Envío a domicilio</span>
                        </label>

                        <label class="radio">
                            <input
                                v-model="form.entrega_tipo"
                                type="radio"
                                value="retiro"
                            />
                            <span>Retira tu producto</span>
                        </label>
                    </div>

                    <!-- Envío a domicilio -->
                    <div
                        v-if="form.entrega_tipo === 'domicilio'"
                        class="space-y-5 mt-6"
                    >
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="label">Dirección*</label>
                                <input
                                    v-model="form.direccion"
                                    type="text"
                                    class="input"
                                />
                                <p v-if="errors2.direccion" class="input-error">
                                    {{ errors2.direccion }}
                                </p>
                            </div>

                            <div>
                                <label class="label">Distrito*</label>
                                <input
                                    v-model="form.distrito"
                                    type="text"
                                    class="input"
                                />
                                <p v-if="errors2.distrito" class="input-error">
                                    {{ errors2.distrito }}
                                </p>
                            </div>

                            <div>
                                <label class="label">Número</label>
                                <input
                                    v-model="form.direccion_numero"
                                    type="text"
                                    class="input"
                                />
                            </div>

                            <div>
                                <label class="label">Piso / Dpto</label>
                                <input
                                    v-model="form.direccion_piso"
                                    type="text"
                                    class="input"
                                />
                            </div>
                        </div>

                        <div>
                            <label class="label">Referencia*</label>
                            <textarea
                                v-model="form.referencia"
                                class="input resize-none"
                                rows="1"
                            ></textarea>
                            <p v-if="errors2.referencia" class="input-error">
                                {{ errors2.referencia }}
                            </p>
                        </div>
                    </div>

                    <!-- Retiro en tienda -->
                    <div
                        v-if="form.entrega_tipo === 'retiro'"
                        class="space-y-5 mt-6"
                    >
                        <div>
                            <label class="label">Punto de retiro</label>
                            <div
                                class="border border-gray-200 rounded-xl p-4 bg-white"
                            >
                                <p class="font-medium">Oficina EkoBusiness</p>
                                <p class="text-sm text-gray-600">
                                    Av. Mariscal La Mar 638, Miraflores
                                </p>
                            </div>
                        </div>

                        <div>
                            <label class="label">Fecha de retiro*</label>
                            <input
                                v-model="form.fecha_retiro"
                                type="date"
                                class="input"
                            />
                            <p v-if="errors2.fecha_retiro" class="input-error">
                                {{ errors2.fecha_retiro }}
                            </p>
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="flex justify-between">
                        <button @click="prevStep" class="button2">
                            <ArrowLeft /> Volver
                        </button>

                        <button @click="continuarPago" class="button">
                            Ir al Pago <ArrowRight />
                        </button>
                    </div>
                </div>

                <!-- Resumen cuando ya se completó -->
                <div
                    v-else-if="step > 2"
                    class="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 shadow-inner flex justify-between items-start"
                >
                    <div>
                        <template v-if="form.entrega_tipo === 'domicilio'">
                            <p>
                                <span class="font-medium"
                                    >Tipo de entrega:</span
                                >
                                Envío a domicilio
                            </p>
                            <p>
                                <span class="font-medium">Dirección:</span>
                                {{ form.direccion }}
                                <template v-if="form.direccion_numero">
                                    Nro: {{ form.direccion_numero }}
                                </template>
                                <template v-if="form.direccion_piso">
                                    Piso: {{ form.direccion_piso }}
                                </template>
                            </p>
                            <p>
                                <span class="font-medium">Distrito:</span>
                                {{ form.distrito }}
                            </p>
                            <p>
                                <span class="font-medium">Referencia:</span>
                                {{ form.referencia }}
                            </p>
                        </template>

                        <template v-else-if="form.entrega_tipo === 'retiro'">
                            <p>
                                <span class="font-medium"
                                    >Tipo de entrega:</span
                                >
                                Retiro en tienda
                            </p>
                            <p>
                                <span class="font-medium"
                                    >Punto de retiro:</span
                                >
                                Oficina EkoBusiness
                            </p>
                            <p>
                                <span class="font-medium"
                                    >Fecha de retiro:</span
                                >
                                {{ form.fecha_retiro }}
                            </p>
                        </template>
                    </div>

                    <button
                        @click="step = 2"
                        class="text-xs text-blue-600 hover:underline cursor-pointer"
                    >
                        Editar
                    </button>
                </div>
            </div>

            <!-- Paso 3: Pago -->
            <div
                class="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm space-y-6"
                v-if="step >= 3"
                ref="seccionForm3"
            >
                <h2 class="text-xl font-semibold">3. Pago</h2>

                <!-- Formulario activo -->
                <div v-if="step === 3" class="space-y-6">
                    <!-- Tipo de comprobante -->
                    <div>
                        <label class="label">Tipo de comprobante*</label>

                        <div class="flex gap-6">
                            <label class="radio">
                                <input
                                    v-model="form.comprobante_tipo"
                                    type="radio"
                                    value="boleta"
                                />
                                <span>Boleta</span>
                            </label>

                            <label class="radio">
                                <input
                                    v-model="form.comprobante_tipo"
                                    type="radio"
                                    value="factura"
                                />
                                <span>Factura</span>
                            </label>
                        </div>
                    </div>

                    <!-- Campos adicionales si es Factura -->
                    <div
                        v-if="form.comprobante_tipo === 'factura'"
                        class="grid md:grid-cols-2 gap-4"
                    >
                        <div>
                            <label class="label">RUC*</label>
                            <input
                                type="text"
                                v-model="form.ruc"
                                maxlength="11"
                                class="input"
                            />
                            <p v-if="errors3.ruc" class="input-error">
                                {{ errors3.ruc }}
                            </p>
                        </div>

                        <div>
                            <label class="label">Razón Social*</label>
                            <input
                                type="text"
                                v-model="form.razon_social"
                                class="input"
                            />
                            <p v-if="errors3.razon_social" class="input-error">
                                {{ errors3.razon_social }}
                            </p>
                        </div>
                    </div>

                    <!-- Método de pago -->
                    <div>
                        <label class="label">Método de pago*</label>

                        <div class="space-y-2">
                            <label
                                v-for="a in pago_metodos"
                                :key="a.id"
                                class="radio border border-gray-300 rounded-xl p-4"
                            >
                                <input
                                    type="radio"
                                    v-model="form.pago_metodo"
                                    :value="a.id"
                                />
                                <span>{{ a.nombre }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="flex justify-between">
                        <button @click="prevStep" class="button2">
                            <ArrowLeft /> Volver
                        </button>

                        <button @click="pagar" class="button">
                            Ir a pagar <ArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Columna derecha: Resumen -->
        <div
            class="border border-gray-200 rounded-2xl p-6 h-fit bg-gray-50 sticky top-20 shadow-sm"
        >
            <h2
                class="text-xl font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-3"
            >
                Resumen del pedido
            </h2>

            <!-- Lista de productos -->
            <div class="space-y-4 mb-6">
                <div
                    v-for="item in items"
                    :key="item.id"
                    class="flex gap-4 border-b border-gray-200 pb-3"
                >
                    <img
                        :src="item.foto"
                        alt="Producto"
                        class="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div class="flex-1">
                        <p
                            class="text-sm font-medium text-gray-800 leading-tight"
                        >
                            {{ item.nombre }}
                        </p>

                        <div class="flex justify-between">
                            <p class="text-xs text-gray-500">
                                Cantidad: {{ item.cantidad }}
                            </p>

                            <p class="text-sm font-semibold text-gray-700 mt-1">
                                S/
                                {{ (item.precio * item.cantidad).toFixed(2) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Totales -->
            <div class="space-y-2 text-sm text-gray-700">
                <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span>S/ {{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Costo de envío</span>
                    <span>
                        <span v-if="costoEnvio > 0"
                            >S/ {{ costoEnvio.toFixed(2) }}</span
                        >
                        <span v-else>Gratis</span>
                    </span>
                </div>

                <div
                    class="flex justify-between text-gray-900 text-lg font-semibold mt-4 border-t border-gray-300 pt-4"
                >
                    <span>Total</span>
                    <span>S/ {{ total.toFixed(2) }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { Cart } from '../../src/lib/cart.js';
import ArrowLeft from '../assets/icons/arrow-left.vue';
import ArrowRight from '../assets/icons/arrow-right.vue';

export default {
    components: {
        ArrowLeft,
        ArrowRight,
    },
    props: {
        pago_metodos: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            theme: 'light',
            step: 1,
            form: {
                email: '',
                telefono: '',
                nombres: '',
                apellidos: '',
                doc_tipo: 'DNI',
                doc_numero: '',
                privacidad: false,

                entrega_tipo: 'domicilio',
                direccion: '',
                distrito: '',
                referencia: '',
                fecha_retiro: '',

                comprobante_tipo: 'boleta',
                ruc: '',
                razon_social: '',
                pago_metodo: 'tarjeta',
            },
            errors1: {},
            errors2: {},
            errors3: {},
            items: [],
        };
    },
    computed: {
        subtotal() {
            return this.items.reduce(
                (acc, item) => acc + item.precio * item.cantidad,
                0
            );
        },
        costoEnvio() {
            // Puedes ajustarlo según tu lógica
            return this.form.entrega_tipo === 'domicilio' ? 10 : 0;
        },
        total() {
            return this.subtotal + this.costoEnvio;
        },
    },
    mounted() {
        this.items = Cart.get();
    },
    methods: {
        validateForm1() {
            Object.keys(this.errors1).forEach((k) => (this.errors1[k] = ''));

            if (
                !this.form.email ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)
            )
                this.errors1.email = 'Ingrese un email válido.';
            if (!this.form.telefono)
                this.errors1.telefono = 'Este campo es obligatorio.';
            if (!this.form.nombres)
                this.errors1.nombres = 'Este campo es obligatorio.';
            if (!this.form.apellidos)
                this.errors1.apellidos = 'Describa su solicitud.';
            if (!this.form.doc_tipo)
                this.errors1.doc_tipo = 'Seleccione un tipo de documento.';
            if (!this.form.doc_numero)
                this.errors1.doc_numero = 'Este campo es obligatorio.';
            if (!this.form.privacidad)
                this.errors1.privacidad = 'Este campo es obligatorio.';

            return Object.values(this.errors1).every((e) => !e);
        },
        continuarEntrega() {
            if (!this.validateForm1()) return;

            this.step = 2;
            this.scrollToForm('seccionForm2');
        },

        validateForm2() {
            Object.keys(this.errors2).forEach((k) => (this.errors2[k] = ''));

            if (this.form.entrega_tipo === 'domicilio') {
                if (!this.form.direccion)
                    this.errors2.direccion = 'Este campo es obligatorio.';
                if (!this.form.distrito)
                    this.errors2.distrito = 'Este campo es obligatorio.';
                if (!this.form.referencia)
                    this.errors2.referencia = 'Describa su solicitud.';
            }

            if (this.form.entrega_tipo === 'retiro') {
                if (!this.form.fecha_retiro)
                    this.errors2.fecha_retiro =
                        'Seleccione un tipo de documento.';
            }

            return Object.values(this.errors2).every((e) => !e);
        },
        continuarPago() {
            if (!this.validateForm2()) return;

            this.step = 3;
            this.scrollToForm('seccionForm3');
        },

        validarForm3() {
            Object.keys(this.errors3).forEach((k) => (this.errors3[k] = ''));

            if (this.form.comprobante_tipo === 'factura') {
                if (!this.form.ruc || !/^\d{11}$/.test(this.form.ruc))
                    this.errors3.ruc =
                        'El RUC debe tener 11 dígitos numéricos.';
                if (!this.form.razon_social)
                    this.errors3.razon_social = 'Describa su solicitud.';
            }

            return Object.values(this.errors3).every((e) => !e);
        },
        pagar() {
            if (!this.validarForm3()) return;
            alert('Pagar');
        },

        prevStep() {
            if (this.step > 1) this.step--;

            if (this.step === 1) {
                this.errors1 = {};
                this.scrollToForm('seccionForm1');
            }
            if (this.step === 2) {
                this.errors2 = {};
                this.scrollToForm('seccionForm2');
            }
            if (this.step === 3) {
                this.errors3 = {};
                this.scrollToForm('seccionForm3');
            }
        },
        scrollToForm(id) {
            setTimeout(() => {
                this.$refs[id].scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    // top: 0,
                });
            }, 100);
        },
    },
};
</script>
