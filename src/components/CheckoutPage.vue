<template>
    <section class="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
        <!-- Columna izquierda: pasos -->
        <div class="md:col-span-2 space-y-8">
            <!-- Encabezado -->
            <div class="flex items-center justify-between mb-10 relative">
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
                            <label class="block text-sm text-gray-600 mb-1"
                                >Correo*</label
                            >
                            <input
                                v-model="form.email"
                                @blur="marcarTocado('email')"
                                @input="tocados.email && validarCampo('email')"
                                type="email"
                                class="input"
                                :class="{
                                    'border-red-500':
                                        errores.email && tocados.email,
                                }"
                            />
                            <p
                                v-if="errores.email && tocados.email"
                                class="text-red-500 text-sm mt-1"
                            >
                                {{ errores.email }}
                            </p>
                        </div>

                        <!-- Teléfono -->
                        <div>
                            <label class="block text-sm text-gray-600 mb-1"
                                >Teléfono*</label
                            >
                            <input
                                v-model="form.telefono"
                                @blur="marcarTocado('telefono')"
                                @input="
                                    tocados.telefono && validarCampo('telefono')
                                "
                                type="text"
                                class="input"
                                :class="{
                                    'border-red-500':
                                        errores.telefono && tocados.telefono,
                                }"
                            />
                            <p
                                v-if="errores.telefono && tocados.telefono"
                                class="text-red-500 text-sm mt-1"
                            >
                                {{ errores.telefono }}
                            </p>
                        </div>

                        <!-- Nombre -->
                        <div>
                            <label class="block text-sm text-gray-600 mb-1"
                                >Nombres*</label
                            >
                            <input
                                v-model="form.nombre"
                                @blur="marcarTocado('nombre')"
                                @input="
                                    tocados.nombre && validarCampo('nombre')
                                "
                                type="text"
                                class="input"
                                :class="{
                                    'border-red-500':
                                        errores.nombre && tocados.nombre,
                                }"
                            />
                            <p
                                v-if="errores.nombre && tocados.nombre"
                                class="text-red-500 text-sm mt-1"
                            >
                                {{ errores.nombre }}
                            </p>
                        </div>

                        <!-- Apellidos -->
                        <div>
                            <label class="block text-sm text-gray-600 mb-1"
                                >Apellidos*</label
                            >
                            <input
                                v-model="form.apellidos"
                                @blur="marcarTocado('apellidos')"
                                @input="
                                    tocados.apellidos &&
                                        validarCampo('apellidos')
                                "
                                type="text"
                                class="input"
                                :class="{
                                    'border-red-500':
                                        errores.apellidos && tocados.apellidos,
                                }"
                            />
                            <p
                                v-if="errores.apellidos && tocados.apellidos"
                                class="text-red-500 text-sm mt-1"
                            >
                                {{ errores.apellidos }}
                            </p>
                        </div>

                        <!-- Tipo de documento -->
                        <div>
                            <label class="block text-sm text-gray-600 mb-1"
                                >Tipo de documento*</label
                            >
                            <select
                                v-model="form.tipoDocumento"
                                @blur="marcarTocado('tipoDocumento')"
                                @change="
                                    tocados.tipoDocumento &&
                                        validarCampo('tipoDocumento')
                                "
                                class="input"
                                :class="{
                                    'border-red-500':
                                        errores.tipoDocumento &&
                                        tocados.tipoDocumento,
                                }"
                            >
                                <option value="DNI">DNI</option>
                                <option value="CE">Carné de Extranjería</option>
                                <option value="PAS">Pasaporte</option>
                            </select>
                            <p
                                v-if="
                                    errores.tipoDocumento &&
                                    tocados.tipoDocumento
                                "
                                class="text-red-500 text-sm mt-1"
                            >
                                {{ errores.tipoDocumento }}
                            </p>
                        </div>

                        <!-- Número de documento -->
                        <div>
                            <label class="block text-sm text-gray-600 mb-1"
                                >Número de documento*</label
                            >
                            <input
                                v-model="form.numeroDocumento"
                                @blur="marcarTocado('numeroDocumento')"
                                @input="
                                    tocados.numeroDocumento &&
                                        validarCampo('numeroDocumento')
                                "
                                type="text"
                                class="input"
                                :class="{
                                    'border-red-500':
                                        errores.numeroDocumento &&
                                        tocados.numeroDocumento,
                                }"
                            />
                            <p
                                v-if="
                                    errores.numeroDocumento &&
                                    tocados.numeroDocumento
                                "
                                class="text-red-500 text-sm mt-1"
                            >
                                {{ errores.numeroDocumento }}
                            </p>
                        </div>

                        <div class="flex flex-col gap-2 text-sm text-gray-600">
                            <label class="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    v-model="form.privacidad"
                                />
                                <span>
                                    He leído y acepto la
                                    <a
                                        href="/politica-de-privacidad"
                                        target="_blank"
                                        class="underline hover:text-neutral-800 transition"
                                    >
                                        política de privacidad </a
                                    >.
                                </span>
                            </label>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button
                            @click="continuarEntrega"
                            class="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition cursor-pointer"
                        >
                            Ir a la Entrega →
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
                            {{ form.nombre }} {{ form.apellidos }}
                        </p>
                        <p>
                            <span class="font-medium">Teléfono:</span>
                            {{ form.telefono }}
                        </p>
                    </div>
                    <button
                        @click="step = 1"
                        class="text-xs text-blue-600 hover:underline"
                    >
                        Editar
                    </button>
                </div>
            </div>

            <!-- Paso 2: Entrega -->
            <div
                class="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm space-y-6"
                v-if="step >= 2"
            >
                <h2 class="text-xl font-semibold">2. Entrega</h2>

                <!-- Formulario activo -->
                <div v-if="step === 2" class="space-y-6">
                    <!-- Opciones principales -->
                    <div class="flex gap-4">
                        <button
                            @click="
                                form.entregaTipo = 'domicilio';
                                errores2 = {};
                            "
                            :class="[
                                'flex-1 py-3 rounded-xl border transition font-medium cursor-pointer',
                                form.entregaTipo === 'domicilio'
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-black',
                            ]"
                        >
                            Envío a domicilio
                        </button>

                        <button
                            @click="
                                form.entregaTipo = 'retiro';
                                errores2 = {};
                            "
                            :class="[
                                'flex-1 py-3 rounded-xl border transition font-medium cursor-pointer',
                                form.entregaTipo === 'retiro'
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-black',
                            ]"
                        >
                            Retira tu producto
                        </button>
                    </div>

                    <!-- Envío a domicilio -->
                    <div
                        v-if="form.entregaTipo === 'domicilio'"
                        class="space-y-5 mt-6"
                    >
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm text-gray-600 mb-1"
                                    >Dirección*</label
                                >
                                <input
                                    v-model="form.direccion"
                                    type="text"
                                    class="input"
                                    @blur="validarCampo2('direccion')"
                                />
                                <p
                                    v-if="errores2.direccion"
                                    class="text-red-500 text-sm mt-1"
                                >
                                    {{ errores2.direccion }}
                                </p>
                            </div>

                            <div>
                                <label class="block text-sm text-gray-600 mb-1"
                                    >Distrito*</label
                                >
                                <input
                                    v-model="form.distrito"
                                    type="text"
                                    class="input"
                                    @blur="validarCampo2('distrito')"
                                />
                                <p
                                    v-if="errores2.distrito"
                                    class="text-red-500 text-sm mt-1"
                                >
                                    {{ errores2.distrito }}
                                </p>
                            </div>

                            <div>
                                <label class="block text-sm text-gray-600 mb-1"
                                    >Número</label
                                >
                                <input
                                    v-model="form.numero"
                                    type="text"
                                    class="input"
                                />
                            </div>

                            <div>
                                <label class="block text-sm text-gray-600 mb-1"
                                    >Piso / Dpto</label
                                >
                                <input
                                    v-model="form.piso"
                                    type="text"
                                    class="input"
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm text-gray-600 mb-1"
                                >Referencia*</label
                            >
                            <textarea
                                v-model="form.referencia"
                                class="input resize-none"
                                rows="1"
                                @blur="validarCampo2('referencia')"
                            ></textarea>
                            <p
                                v-if="errores2.referencia"
                                class="text-red-500 text-sm mt-1"
                            >
                                {{ errores2.referencia }}
                            </p>
                        </div>
                    </div>

                    <!-- Retiro en tienda -->
                    <div
                        v-if="form.entregaTipo === 'retiro'"
                        class="space-y-5 mt-6"
                    >
                        <div>
                            <label class="block text-sm text-gray-600 mb-1"
                                >Punto de retiro</label
                            >
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
                            <label class="block text-sm text-gray-600 mb-1"
                                >Fecha de retiro*</label
                            >
                            <input
                                v-model="form.fechaRetiro"
                                type="date"
                                class="input"
                                @blur="validarCampo2('fechaRetiro')"
                            />
                            <p
                                v-if="errores2.fechaRetiro"
                                class="text-red-500 text-sm mt-1"
                            >
                                {{ errores2.fechaRetiro }}
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-between">
                        <button
                            @click="prevStep"
                            class="text-gray-600 hover:text-black transition cursor-pointer"
                        >
                            ← Volver
                        </button>
                        <button
                            @click="continuarPago"
                            class="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition cursor-pointer"
                        >
                            Ir al Pago →
                        </button>
                    </div>
                </div>

                <!-- Resumen cuando ya se completó -->
                <div
                    v-else-if="step > 2"
                    class="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 shadow-inner flex justify-between items-start"
                >
                    <div>
                        <template v-if="form.entregaTipo === 'domicilio'">
                            <p>
                                <span class="font-medium"
                                    >Tipo de entrega:</span
                                >
                                Envío a domicilio
                            </p>
                            <p>
                                <span class="font-medium">Dirección:</span>
                                {{ form.direccion }}
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

                        <template v-else-if="form.entregaTipo === 'retiro'">
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
                                {{ form.fechaRetiro }}
                            </p>
                        </template>
                    </div>

                    <button
                        @click="step = 2"
                        class="text-xs text-blue-600 hover:underline"
                    >
                        Editar
                    </button>
                </div>
            </div>

            <!-- Paso 3: Pago -->
            <div
                class="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm space-y-6"
                v-if="step >= 3"
            >
                <h2 class="text-xl font-semibold">3. Pago</h2>

                <!-- Formulario activo -->
                <div v-if="step === 3" class="space-y-6">
                    <!-- Tipo de comprobante -->
                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >Tipo de comprobante</label
                        >

                        <div class="flex gap-6">
                            <label
                                class="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    value="boleta"
                                    v-model="form.tipoComprobante"
                                    class="text-black"
                                />
                                <span>Boleta</span>
                            </label>

                            <label
                                class="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    value="factura"
                                    v-model="form.tipoComprobante"
                                    class="text-black"
                                />
                                <span>Factura</span>
                            </label>
                        </div>
                    </div>

                    <!-- Campos adicionales si es Factura -->
                    <div
                        v-if="form.tipoComprobante === 'factura'"
                        class="space-y-4 grid md:grid-cols-2 gap-4"
                    >
                        <div>
                            <label class="block text-sm font-medium mb-1"
                                >RUC*</label
                            >
                            <input
                                type="text"
                                v-model="form.ruc"
                                maxlength="11"
                                @input="validarCampo3('ruc')"
                                class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                            />
                            <p
                                v-if="errores3.ruc"
                                class="text-red-500 text-sm mt-1"
                            >
                                {{ errores3.ruc }}
                            </p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-1"
                                >Razón Social*</label
                            >
                            <input
                                type="text"
                                v-model="form.razonSocial"
                                @input="validarCampo3('razonSocial')"
                                class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                            />
                            <p
                                v-if="errores3.razonSocial"
                                class="text-red-500 text-sm mt-1"
                            >
                                {{ errores3.razonSocial }}
                            </p>
                        </div>
                    </div>

                    <!-- Método de pago -->
                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >Método de pago</label
                        >
                        <div class="space-y-3">
                            <label
                                class="flex items-center gap-3 border border-gray-300 rounded-xl p-4 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    v-model="form.metodoPago"
                                    value="tarjeta"
                                />
                                <span>Tarjeta de crédito o débito</span>
                            </label>

                            <label
                                class="flex items-center gap-3 border border-gray-300 rounded-xl p-4 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    v-model="form.metodoPago"
                                    value="yape"
                                />
                                <span>Yape / Plin</span>
                            </label>
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="flex justify-between">
                        <button
                            @click="prevStep"
                            class="text-gray-600 hover:text-black transition cursor-pointer"
                        >
                            ← Volver
                        </button>
                        <button
                            @click="pagar"
                            class="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition cursor-pointer"
                        >
                            Ir a pagar
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
                                S/ {{ (item.precio * item.cantidad).toFixed(2) }}
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

export default {
    data() {
        return {
            step: 1,
            form: {
                email: '',
                telefono: '',
                nombre: '',
                apellidos: '',
                tipoDocumento: 'DNI',
                numeroDocumento: '',
                privacidad: false,

                entregaTipo: 'domicilio',
                direccion: '',
                distrito: '',
                referencia: '',
                fechaRetiro: '',

                tipoComprobante: 'boleta',
                ruc: '',
                razonSocial: '',
                metodoPago: 'tarjeta',
            },
            errores: {},
            errores2: {},
            errores3: {},
            tocados: {},
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
            return this.form.entregaTipo === 'domicilio' ? 10 : 0;
        },
        total() {
            return this.subtotal + this.costoEnvio;
        },
    },
    mounted() {
        this.items = Cart.get();
    },
    methods: {
        validarCampo(campo) {
            const valor = this.form[campo];
            let error = '';

            switch (campo) {
                case 'email':
                    if (!valor) error = 'El correo es obligatorio.';
                    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor))
                        error = 'El correo no es válido.';
                    break;

                case 'telefono':
                    if (!valor) error = 'El teléfono es obligatorio.';
                    else if (!/^\d{9}$/.test(valor))
                        error = 'Debe tener 9 dígitos numéricos.';
                    break;

                case 'nombre':
                    if (!valor) error = 'El nombre es obligatorio.';
                    break;

                case 'apellidos':
                    if (!valor) error = 'Los apellidos son obligatorios.';
                    break;

                case 'tipoDocumento':
                    if (!valor) error = 'Seleccione un tipo de documento.';
                    break;

                case 'numeroDocumento':
                    if (!valor) {
                        error = 'El número de documento es obligatorio';
                    } else if (
                        this.form.tipoDocumento === 'DNI' &&
                        !/^\d{8}$/.test(valor)
                    ) {
                        error = 'El DNI debe tener 8 carácteres';
                    } else if (
                        (this.form.tipoDocumento === 'CE' ||
                            this.form.tipoDocumento === 'PAS') &&
                        !/^[A-Za-z0-9]{1,12}$/.test(valor)
                    ) {
                        error = 'Debe tener hasta 12 carácteres';
                    }
                    break;
            }

            this.errores[campo] = error;
        },

        // 🔹 cuando el usuario toque un campo
        marcarTocado(campo) {
            this.tocados[campo] = true;
            this.validarCampo(campo);
        },
        continuarEntrega() {
            [
                'email',
                'telefono',
                'nombre',
                'apellidos',
                'tipoDocumento',
                'numeroDocumento',
            ].forEach((campo) => this.validarCampo(campo));

            // Si hay errores, no avanzar
            const tieneErrores = Object.values(this.errores).some((e) => e);
            if (tieneErrores) {
                alert('Ingrese todos los campos obligatorios.');
                return;
            }

            // Verificar checkbox de privacidad
            if (!this.form.privacidad) {
                alert(
                    'Debes aceptar la Política de Privacidad antes de continuar.'
                );
                return;
            }

            // Si todo está correcto, pasar al paso 2
            this.step = 2;
        },

        validarCampo2(campo) {
            switch (campo) {
                case 'direccion':
                    this.errores2.direccion = this.form.direccion.trim()
                        ? ''
                        : 'La dirección es obligatoria.';
                    break;
                case 'distrito':
                    this.errores2.distrito = this.form.distrito.trim()
                        ? ''
                        : 'El distrito es obligatorio.';
                    break;
                case 'referencia':
                    this.errores2.referencia = this.form.referencia.trim()
                        ? ''
                        : 'La referencia es obligatoria.';
                    break;
                case 'fechaRetiro':
                    this.errores2.fechaRetiro = this.form.fechaRetiro
                        ? ''
                        : 'La fecha de retiro es obligatoria.';
                    break;
            }
        },
        continuarPago() {
            // Si elige envío a domicilio
            if (this.form.entregaTipo === 'domicilio') {
                // Forzar validación de todos los campos requeridos
                ['direccion', 'distrito', 'referencia'].forEach((campo) =>
                    this.validarCampo2(campo)
                );
            }

            // Si elige retiro en tienda
            if (this.form.entregaTipo === 'retiro') {
                this.validarCampo2('fechaRetiro');
            }

            // Verificar si hay errores
            const tieneErrores = Object.values(this.errores2).some((e) => e);
            if (tieneErrores) {
                alert('Ingrese todos los campos obligatorios.');
                return;
            }

            this.step = 3; // Avanza al paso 3 solo si no hay errores
        },

        validarCampo3(campo) {
            switch (campo) {
                case 'ruc':
                    if (!this.form.ruc.trim())
                        this.errores3.ruc = 'El RUC es obligatorio.';
                    else if (!/^\d{11}$/.test(this.form.ruc))
                        this.errores3.ruc =
                            'El RUC debe tener 11 dígitos numéricos.';
                    else this.errores3.ruc = '';
                    break;
                case 'razonSocial':
                    this.errores3.razonSocial = this.form.razonSocial.trim()
                        ? ''
                        : 'La razón social es obligatoria.';
                    break;
            }
        },

        prevStep() {
            if (this.step > 1) this.step--;
        },

        pagar() {
            alert('Pagar');
        },
    },
};
</script>
