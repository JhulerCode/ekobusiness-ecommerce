<template>
    <section
        class="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10"
        v-if="paymentSuccess == false"
    >
        <!-- Columna izquierda: pasos -->
        <div class="md:col-span-2 flex md:flex-row flex-col gap-10">
            <!-- Encabezado -->
            <div
                class="md:sticky md:top-20 md:h-fit flex md:flex-col"
            >
                <!-- Paso 1 -->
                <div class="flex flex-col md:flex-row gap-2 items-center">
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
                        class="text-sm transition-colors duration-300"
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
                    class="w-[2px] h-20 mx-5 my-2"
                    :class="step > 1 ? 'bg-black' : 'bg-gray-300'"
                ></div>

                <!-- Paso 2 -->
                <div class="flex flex-col md:flex-row gap-2 items-center">
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
                        class="text-sm transition-colors duration-300"
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
                    class="w-[2px] h-20 mx-5 my-2"
                    :class="step > 2 ? 'bg-black' : 'bg-gray-300'"
                ></div>

                <!-- Paso 3 -->
                <div class="flex flex-col md:flex-row gap-2 items-center">
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
                        class="text-sm transition-colors duration-300"
                        :class="{
                            'text-black font-medium': step >= 3,
                            'text-gray-400': step < 3,
                        }"
                    >
                        Pago
                    </span>
                </div>
            </div>

            <div class="flex-1 space-y-8">
                <!-- Paso 1: Identificación -->
                <div
                    class="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm space-y-6"
                    ref="seccionForm1"
                >
                    <h2 class="text-xl font-semibold">1. Identificación</h2>

                    <!-- Formulario activo -->
                    <div v-if="step === 1" class="space-y-6">
                        <p class="text-gray-600">
                            Por favor completa con tu información personal para
                            poder finalizar la compra.
                        </p>

                        <div
                            class="grid md:grid-cols-2 gap-4"
                            v-if="form.socio_datos"
                        >
                            <JdInput
                                label="Correo"
                                :nec="true"
                                type="email"
                                v-model="form.socio_datos.correo"
                                :error="errors.correo"
                            />

                            <div>
                                <JdInput
                                    label="Teléfono"
                                    :nec="true"
                                    type="tel"
                                    v-model="form.socio_datos.telefono"
                                    :error="errors.telefono"
                                />
                            </div>

                            <JdInput
                                label="Nombres"
                                :nec="true"
                                v-model="form.socio_datos.nombres"
                                :error="errors.nombres"
                            />

                            <JdInput
                                label="Apellidos"
                                :nec="true"
                                v-model="form.socio_datos.apellidos"
                                :error="errors.apellidos"
                            />

                            <JdSelect
                                label="Tipo de documento"
                                :nec="true"
                                :lista="doc_tipos"
                                v-model="form.socio_datos.doc_tipo"
                                :error="errors.doc_tipo"
                            />

                            <JdInput
                                label="Nro de documento"
                                :nec="true"
                                v-model="form.socio_datos.doc_numero"
                                :error="errors.doc_numero"
                            />

                            <JdCheckBox
                                :nec="true"
                                v-model="form.socio_datos.privacidad"
                                :error="errors.privacidad"
                                class="col-span-2"
                            >
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
                            </JdCheckBox>
                        </div>

                        <!-- Botones -->
                        <div class="flex justify-end">
                            <JdButton
                                text="Ir a la Entrega"
                                @click="continuarEntrega"
                                :loading="loading"
                            >
                                <template v-slot:iRight>
                                    <ArrowRight />
                                </template>
                            </JdButton>
                        </div>
                    </div>

                    <!-- Resumen cuando ya se completó -->
                    <div
                        v-else
                        class="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 shadow-inner flex justify-between items-start"
                    >
                        <div v-if="form.socio_datos">
                            <p>
                                <span class="font-medium">Correo:</span>
                                {{ form.socio_datos.correo }}
                            </p>
                            <p>
                                <span class="font-medium">Teléfono:</span>
                                {{ form.socio_datos.telefono }}
                            </p>
                            <p>
                                <span class="font-medium">Nombre:</span>
                                {{ form.socio_datos.nombres }}
                                {{ form.socio_datos.apellidos }}
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
                        <JdRadio
                            :nec="true"
                            :lista="entrega_tipos"
                            v-model="form.entrega_tipo"
                            :error="errors.entrega_tipo"
                            :row="true"
                            @change="errors = {}"
                        />

                        <!-- Envío a domicilio -->
                        <div
                            v-if="form.entrega_tipo === 'envio'"
                            class="mt-6 grid md:grid-cols-2 gap-4"
                        >
                            <JdSelectQuery
                                label="Distrito"
                                :nec="true"
                                v-model="form.entrega_ubigeo"
                                :spin="ubigeosLoading"
                                :lista="ubigeos"
                                @search="loadUbigeos"
                                @elegir="setUbigeo"
                                :error="errors.entrega_ubigeo"
                                class="col-span-2"
                            />

                            <JdInput
                                label="Dirección"
                                :nec="true"
                                v-model="form.direccion_entrega"
                                :error="errors.direccion_entrega"
                                class="col-span-2"
                            />

                            <JdInput
                                label="Número"
                                v-model="form.entrega_direccion_datos.numero"
                                :error="errors.entrega_direccion_datos_numero"
                            />

                            <JdInput
                                label="Piso / Dpto"
                                v-model="form.entrega_direccion_datos.piso"
                                :error="errors.entrega_direccion_datos_piso"
                            />

                            <JdTextArea
                                label="Referencia"
                                :nec="true"
                                v-model="
                                    form.entrega_direccion_datos.referencia
                                "
                                :error="
                                    errors.entrega_direccion_datos_referencia
                                "
                                class="col-span-2"
                            />
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
                                    <p class="font-medium">
                                        Oficina EkoBusiness
                                    </p>
                                    <p class="text-sm text-gray-600">
                                        Av. Mariscal La Mar 638, Miraflores
                                    </p>
                                </div>
                            </div>

                            <JdInput
                                label="Fecha de retiro"
                                :nec="true"
                                type="date"
                                v-model="form.fecha_entrega"
                                :error="errors.fecha_entrega"
                            />
                        </div>

                        <!-- Botones -->
                        <div class="flex justify-between">
                            <JdButton text="Volver" tipo="2" @click="prevStep">
                                <template v-slot:iLeft>
                                    <ArrowLeft />
                                </template>
                            </JdButton>

                            <JdButton text="Ir al Pago" @click="continuarPago">
                                <template v-slot:iRight>
                                    <ArrowRight />
                                </template>
                            </JdButton>
                        </div>
                    </div>

                    <!-- Resumen cuando ya se completó -->
                    <div
                        v-else-if="step > 2"
                        class="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 shadow-inner flex justify-between items-start"
                    >
                        <div>
                            <template v-if="form.entrega_tipo === 'envio'">
                                <p>
                                    <span class="font-medium"
                                        >Tipo de entrega:</span
                                    >
                                    Envío a domicilio
                                </p>
                                <p>
                                    <span class="font-medium">Dirección:</span>
                                    {{ form.direccion_entrega }}
                                    <template
                                        v-if="
                                            form.entrega_direccion_datos.numero
                                        "
                                    >
                                        Nro:
                                        {{
                                            form.entrega_direccion_datos.numero
                                        }}
                                    </template>
                                    <template
                                        v-if="form.entrega_direccion_datos.piso"
                                    >
                                        Piso:
                                        {{ form.entrega_direccion_datos.piso }}
                                    </template>
                                </p>
                                <p v-if="form.entrega_ubigeo1">
                                    <span class="font-medium">Distrito:</span>
                                    {{ form.entrega_ubigeo1.distrito }},
                                    {{ form.entrega_ubigeo1.provincia }},
                                    {{ form.entrega_ubigeo1.departamento }}
                                </p>
                                <p>
                                    <span class="font-medium">Referencia:</span>
                                    {{
                                        form.entrega_direccion_datos.referencia
                                    }}
                                </p>
                            </template>

                            <template
                                v-else-if="form.entrega_tipo === 'retiro'"
                            >
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
                                    {{ form.fecha_entrega }}
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
                    <div v-if="step === 3" class="space-y-4">
                        <!-- Tipo de comprobante -->
                        <JdRadio
                            label="Tipo de comprobante"
                            :nec="true"
                            :lista="comprobante_tipos"
                            v-model="form.comprobante_tipo"
                            :error="errors.comprobante_tipo"
                            :row="true"
                            @change="errors = {}"
                        />

                        <!-- Campos adicionales si es Factura -->
                        <div
                            v-if="form.comprobante_tipo === '01'"
                            class="grid md:grid-cols-2 gap-4"
                        >
                            <JdInput
                                label="RUC"
                                :nec="true"
                                v-model="form.comprobante_ruc"
                                :error="errors.comprobante_ruc"
                            />

                            <JdInput
                                label="RUC"
                                :nec="true"
                                v-model="form.comprobante_razon_social"
                                :error="errors.comprobante_razon_social"
                            />
                        </div>

                        <!-- Método de pago -->
                        <JdRadio
                            label="Método de pago"
                            :nec="true"
                            :lista="pago_metodos"
                            v-model="form.pago_metodo"
                            :error="errors.pago_metodo"
                            :withBorder="true"
                            @change="errors = {}"
                        />

                        <!-- Botones -->
                        <div class="flex justify-between">
                            <JdButton text="Volver" tipo="2" @click="prevStep">
                                <template v-slot:iLeft>
                                    <ArrowLeft />
                                </template>
                            </JdButton>

                            <JdButton
                                text="Ir a pagar"
                                @click="pagar"
                                :loading="loading"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Columna derecha: Resumen -->
        <div
            class="border border-gray-200 rounded-2xl p-6 h-fit sticky top-20 shadow-sm"
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

            <div class="container"></div>
        </div>
    </section>

    <div id="myPaymentForm">
        <div class="kr-embedded" kr-popin>
            <div class="kr-pan"></div>
            <div class="kr-expiry"></div>
            <div class="kr-security-code"></div>
            <div class="kr-form-error"></div>
            <button class="kr-payment-button"></button>
        </div>
    </div>

    <section
        class="max-w-6xl mx-auto px-4 py-12 gap-10"
        v-if="paymentSuccess == true"
    >
        <div
            class="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-md border border-gray-100 animate-fade-in"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-20 h-20 text-green-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2l4 -4m6 2a9 9 0 1 1 -18 0a9 9 0 0 1 18 0z"
                />
            </svg>

            <h2 class="text-2xl font-semibold text-gray-800 mb-2">
                ¡Pago confirmado!
            </h2>

            <p class="text-gray-600 mb-6">
                Tu pago ha sido procesado exitosamente. En unos momentos
                recibirás un correo con los detalles de tu compra.
            </p>

            <div class="flex gap-4">
                <JdButton text="Ir al inicio" tipo="2" @click="irInicio" />
                <JdButton text="Ver mi pedido" @click="irPedido" />
            </div>
        </div>
    </section>
</template>

<script>
import ArrowLeft from '../assets/icons/arrow-left.vue';
import ArrowRight from '../assets/icons/arrow-right.vue';
import JdButton from '../components/JdButton.vue';
import JdInput from '../components/JdInput.vue';
import JdSelect from '../components/JdSelect.vue';
import JdCheckBox from '../components/JdCheckBox.vue';
import JdRadio from '../components/JdRadio.vue';
import JdTextArea from '../components/JdTextArea.vue';
import JdSelectQuery from '../components/JdSelectQuery.vue';

import { Cart } from '../lib/cart.js';
import { urls, get, post } from '../lib/api.js';
import { genId } from '../lib/mine.js';

import KRGlue from '@lyracom/embedded-form-glue';

export default {
    components: {
        ArrowLeft,
        ArrowRight,
        JdButton,
        JdInput,
        JdSelect,
        JdCheckBox,
        JdRadio,
        JdTextArea,
        JdSelectQuery,
    },
    props: {
        pago_metodos: { type: Array, default: () => [] },
        doc_tipos: { type: Array, default: () => [] },
        entrega_tipos: { type: Array, default: () => [] },
        comprobante_tipos: { type: Array, default: () => [] },
    },
    data() {
        return {
            step: 3,
            paymentSuccess: false,
            loading: false,

            form: {},
            errors: {},
            items: [],

            ubigeos: [],
            ubigeosLoading: false,
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
            return this.form.entrega_tipo === 'envio' ? 10 : 0;
        },
        total() {
            return this.subtotal + this.costoEnvio;
        },
    },
    mounted() {
        this.items = Cart.get();
        this.initForm();
    },
    methods: {
        initForm() {
            this.form = {
                tipo: 2,
                fecha: new Date(),
                codigo: genId(),

                socio: null,
                socio_datos: {
                    nombres: '',
                    apellidos: '',
                    doc_tipo: 'DNI',
                    doc_numero: '',
                    correo: 'jhuler1615@gmail.com',
                    telefono: '',
                    privacidad: false,
                },

                entrega_tipo: 'envio',
                fecha_entrega: '',
                entrega_ubigeo: '',
                direccion_entrega: '',
                entrega_direccion_datos: {},

                comprobante_tipo: '03',
                comprobante_ruc: '',
                comprobante_razon_social: '',

                pago_metodo: 'tarjeta',
                monto: 100,
                socio_pedido_items: this.items,
            };
        },

        validateForm1() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

            if (
                !this.form.socio_datos.correo ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.socio_datos.correo)
            )
                this.errors.correo = 'Ingrese un correo válido.';
            if (!this.form.socio_datos.telefono)
                this.errors.telefono = 'Este campo es obligatorio.';
            if (!this.form.socio_datos.nombres)
                this.errors.nombres = 'Este campo es obligatorio.';
            if (!this.form.socio_datos.apellidos)
                this.errors.apellidos = 'Describa su solicitud.';
            if (!this.form.socio_datos.doc_tipo)
                this.errors.doc_tipo = 'Seleccione un tipo de documento.';
            if (!this.form.socio_datos.doc_numero)
                this.errors.doc_numero = 'Este campo es obligatorio.';
            if (!this.form.socio_datos.privacidad)
                this.errors.privacidad = 'Este campo es obligatorio.';

            return Object.values(this.errors).every((e) => !e);
        },
        continuarEntrega() {
            if (!this.validateForm1()) return;

            this.step = 2;
            this.scrollToForm('seccionForm2');
        },

        validateForm2() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

            if (this.form.entrega_tipo === 'envio') {
                if (!this.form.entrega_ubigeo)
                    this.errors.entrega_ubigeo = 'Este campo es obligatorio.';
                if (!this.form.direccion_entrega)
                    this.errors.direccion_entrega =
                        'Este campo es obligatorio.';
                if (!this.form.entrega_direccion_datos.referencia)
                    this.errors.entrega_direccion_datos_referencia =
                        'Este campo es obligatorio.';
            }

            if (this.form.entrega_tipo === 'retiro') {
                if (!this.form.fecha_entrega)
                    this.errors.fecha_entrega = 'Este campo es obligatorio.';
            }

            return Object.values(this.errors).every((e) => !e);
        },
        continuarPago() {
            if (!this.validateForm2()) return;

            this.step = 3;
            this.scrollToForm('seccionForm3');
        },

        validarForm3() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

            if (this.form.comprobante_tipo === '01') {
                if (!this.form.ruc || !/^\d{11}$/.test(this.form.ruc))
                    this.errors.ruc = 'El RUC debe tener 11 dígitos numéricos.';
                if (!this.form.razon_social)
                    this.errors.razon_social = 'Describa su solicitud.';
            }

            return Object.values(this.errors).every((e) => !e);
        },
        async pagar() {
            // if (!this.validarForm3()) return;

            // this.loading = true;
            // const res = await post(`${urls.izipay}/create-payment`, this.form);
            // this.loading = false;

            // if (res.code == 0) {
            //     const endpoint = 'https://api.micuentaweb.pe';
            //     const publicKey = import.meta.env.IZIPAY_PUBLIC_KEY;

            //     const { KR } = await KRGlue.loadLibrary(endpoint, publicKey);

            //     await KR.setFormConfig({
            //         formToken: res.data.formToken,
            //         'kr-language': 'es-PE',
            //     });

            //     await KR.onSubmit(async (paymentData) => {
            //         const res1 = await post(
            //             `${urls.izipay}/validate-payment`,
            //             paymentData
            //         );

            //         if (res1.code == 0) {
            //             KR.closePopin();

            //             this.paymentSuccess = true;

            this.loading = true;
            // await post('socio_pedidos', this.form);
            console.log(this.form);
            this.loading = false;

            //             Cart.clear();
            //         }

            //         return false;
            //     });

            //     await KR.renderElements('#myPaymentForm');

            //     await KR.openPopin();
            // }
        },

        prevStep() {
            if (this.step > 1) this.step--;
            this.errors = {};

            if (this.step === 1) {
                this.scrollToForm('seccionForm1');
            }
            if (this.step === 2) {
                this.scrollToForm('seccionForm2');
            }
            if (this.step === 3) {
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
            this.form.entrega_ubigeo1 = item;
        },

        irPedido() {
            window.location.href = '/account';
        },
        irInicio() {
            window.location.href = '/';
        },
    },
};
</script>
