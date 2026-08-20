<template>
    <section class="checkout-success" v-if="paymentSuccess == true" v-bind="$attrs">
        <article class="checkout-success__card">
            <div class="checkout-success__icon" aria-hidden="true">✓</div>

            <p class="checkout-success__eyebrow">
                {{ form.pago_metodo === 'yape' ? 'Pedido recibido' : 'Pago confirmado' }}
            </p>

            <h2>
                {{
                    form.pago_metodo === 'yape'
                        ? 'Tu pedido fue recibido'
                        : 'Tu compra está confirmada'
                }}
            </h2>

            <p class="checkout-success__lead">
                {{
                    form.pago_metodo === 'yape'
                        ? 'En unos momentos recibirás un correo con todos los detalles de tu pedido.'
                        : 'Procesamos tu pago correctamente. En unos momentos recibirás un correo con los detalles de tu compra.'
                }}
            </p>

            <div v-if="form.codigo" class="checkout-success__order">
                <span>Número de pedido</span>
                <strong>{{ form.codigo }}</strong>
            </div>

            <div v-if="form.pago_metodo === 'yape'" class="checkout-success__notice">
                <span>Pago por validar</span>
                <p>
                    Nuestro equipo verificará el pago realizado por Yape y actualizará el estado de
                    tu pedido a la brevedad.
                </p>
            </div>

            <div class="checkout-success__actions">
                <a :href="`/pedidos/${form.id}`" class="checkout-success__action is-primary">
                    {{ form.pago_metodo === 'yape' ? 'Ver estado del pedido' : 'Ver mi pedido' }}
                </a>
                <a href="/tienda" class="checkout-success__action is-secondary">
                    Seguir comprando
                </a>
            </div>
        </article>
    </section>

    <section class="checkout-layout" v-else v-bind="$attrs">
        <!-- Columna izquierda: pasos -->
        <div class="checkout-workspace">
            <!-- Encabezado -->
            <nav class="checkout-steps" aria-label="Progreso de compra">
                <!-- Paso 1 -->
                <div class="checkout-step" :class="{ 'is-active': step === 1, 'is-done': step > 1 }">
                    <div
                        class="checkout-step__number"
                        :class="{
                            'is-current': step === 1,
                            'is-complete': step > 1,
                        }"
                    >
                        1
                    </div>

                    <span
                        class="checkout-step__label"
                    >
                        Identificación
                    </span>
                </div>

                <!-- Línea entre pasos -->
                <div
                    class="checkout-step__line"
                    :class="{ 'is-complete': step > 1 }"
                ></div>

                <!-- Paso 2 -->
                <div class="checkout-step" :class="{ 'is-active': step === 2, 'is-done': step > 2 }">
                    <div
                        class="checkout-step__number"
                        :class="{
                            'is-current': step === 2,
                            'is-complete': step > 2,
                        }"
                    >
                        2
                    </div>

                    <span
                        class="checkout-step__label"
                    >
                        Entrega
                    </span>
                </div>

                <!-- Línea entre pasos -->
                <div
                    class="checkout-step__line"
                    :class="{ 'is-complete': step > 2 }"
                ></div>

                <!-- Paso 3 -->
                <div class="checkout-step" :class="{ 'is-active': step === 3 }">
                    <div
                        class="checkout-step__number"
                        :class="{
                            'is-current': step === 3,
                        }"
                    >
                        3
                    </div>

                    <span
                        class="checkout-step__label"
                    >
                        Pago
                    </span>
                </div>
            </nav>

            <div class="checkout-panels">
                <!-- Paso 1: Identificación -->
                <div
                    class="checkout-card"
                    ref="seccionForm1"
                >
                    <div class="checkout-card__heading">
                        <span>01</span>
                        <div>
                            <p>Datos personales</p>
                            <h2>Identificación</h2>
                        </div>
                    </div>

                    <!-- Formulario activo -->
                    <div v-if="step === 1" class="space-y-6">
                        <p class="text-gray-600">
                            Por favor completa con tu información personal para poder finalizar la
                            compra.
                        </p>

                        <div class="grid md:grid-cols-2 gap-4" v-if="form.socio_datos">
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

                            <JdSelect
                                label="Tipo de documento"
                                :nec="true"
                                :lista="documentos_identidad.filter((item) => Number(item.id) !== 6)"
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
                                    y declaro haber sido informado sobre el tratamiento de mis datos
                                    personales.
                                </span>
                            </JdCheckBox>
                        </div>

                    </div>

                    <!-- Resumen cuando ya se completó -->
                    <div
                        v-else
                        class="checkout-completed"
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
                    class="checkout-card"
                    v-if="step >= 2"
                    ref="seccionForm2"
                >
                    <div class="checkout-card__heading">
                        <span>02</span>
                        <div>
                            <p>Cómo recibirás tu pedido</p>
                            <h2>Entrega</h2>
                        </div>
                    </div>

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
                            <template v-if="user.id">
                                <JdInput
                                    label="Nombre"
                                    placeholder="Ej. Casa, Trabajo"
                                    :nec="true"
                                    v-model="form.direccion_nombre"
                                    :error="errors.direccion_nombre"
                                    v-if="form.new_direccion"
                                />

                                <JdSelect
                                    label="Dirección guardada"
                                    :lista="user.direcciones || []"
                                    v-model="form.entrega_direccion_id"
                                    :error="errors.entrega_direccion_id"
                                    @elegir="setDireccion"
                                    v-else
                                />

                                <JdCheckBox
                                    label="Nueva dirección"
                                    :nec="true"
                                    v-model="form.new_direccion"
                                    @change="cleanDireccion"
                                />
                            </template>

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
                                v-model="form.entrega_direccion_datos.referencia"
                                :error="errors.entrega_direccion_datos_referencia"
                                class="col-span-2"
                            />
                        </div>

                        <!-- Retiro en tienda -->
                        <div v-if="form.entrega_tipo === 'retiro'" class="space-y-5 mt-6">
                            <div>
                                <label class="label">Punto de retiro</label>
                                <div class="border border-gray-200 rounded-xl p-4 bg-white">
                                    <p class="font-medium">Oficina EkoBusiness</p>
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

                        <div class="checkout-panel-back">
                            <JdButton text="Volver" tipo="2" @click="prevStep">
                                <template v-slot:iLeft>
                                    <ArrowLeft />
                                </template>
                            </JdButton>
                        </div>
                    </div>

                    <!-- Resumen cuando ya se completó -->
                    <div
                        v-else-if="step > 2"
                        class="checkout-completed"
                    >
                        <div>
                            <template v-if="form.entrega_tipo === 'envio'">
                                <p>
                                    <span class="font-medium">Tipo de entrega:</span>
                                    Envío a domicilio
                                </p>
                                <p>
                                    <span class="font-medium">Dirección:</span>
                                    {{ form.direccion_entrega }}
                                    <template v-if="form.entrega_direccion_datos.numero">
                                        Nro:
                                        {{ form.entrega_direccion_datos.numero }}
                                    </template>
                                    <template v-if="form.entrega_direccion_datos.piso">
                                        Piso:
                                        {{ form.entrega_direccion_datos.piso }}
                                    </template>
                                </p>
                                <p v-if="form.entrega_direccion_datos.ubigeo1">
                                    <span class="font-medium">Distrito:</span>
                                    {{ form.entrega_direccion_datos.ubigeo1.nombre }}
                                </p>
                                <p>
                                    <span class="font-medium">Referencia:</span>
                                    {{ form.entrega_direccion_datos.referencia }}
                                </p>
                            </template>

                            <template v-else-if="form.entrega_tipo === 'retiro'">
                                <p>
                                    <span class="font-medium">Tipo de entrega:</span>
                                    Retiro en tienda
                                </p>
                                <p>
                                    <span class="font-medium">Punto de retiro:</span>
                                    Oficina EkoBusiness
                                </p>
                                <p>
                                    <span class="font-medium">Fecha de retiro:</span>
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
                    class="checkout-card"
                    v-if="step >= 3"
                    ref="seccionForm3"
                >
                    <div class="checkout-card__heading">
                        <span>03</span>
                        <div>
                            <p>Comprobante y método</p>
                            <h2>Pago seguro</h2>
                        </div>
                    </div>

                    <!-- Formulario activo -->
                    <div v-if="step === 3" class="space-y-4">
                        <!-- Tipo de comprobante -->
                        <JdRadio
                            label="Tipo de comprobante"
                            :nec="true"
                            :lista="comprobante_tipos.filter((a) => a.id != 'NV')"
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
                                label="Razon social"
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

                        <div class="space-y-4 bg-gray-50 p-4 rounded-xl">
                            <!-- Si el método es TARJETA -->
                            <template v-if="form.pago_metodo === 'tarjeta'">
                                <!-- <JdButton
                                    text="Recargar wallet"
                                    @click="getCustomerWallet"
                                    :loading="loading"
                                /> -->

                                <p class="text-gray-500 text-sm">
                                    Elige una tarjeta guardada o ingresa una nueva.
                                </p>

                                <div class="grid gap-3">
                                    <p v-if="errors.paymentMethodToken" class="input-error">
                                        {{ errors.paymentMethodToken }}
                                    </p>
                                    <!-- Tarjetas guardadas -->
                                    <div
                                        v-for="(card, i) in user.wallet"
                                        :key="i"
                                        class="radio justify-between border border-sunka-sand p-4"
                                        :class="{
                                            'bg-gray-50':
                                                form.paymentMethodToken === card.paymentMethodToken,
                                        }"
                                        @click="form.paymentMethodToken = card.paymentMethodToken"
                                    >
                                        <div class="flex items-center gap-3">
                                            <img
                                                :src="
                                                    getCardBrandIcon(
                                                        card.tokenDetails.effectiveBrand,
                                                    )
                                                "
                                                class="w-8 h-8"
                                                alt="card brand"
                                            />
                                            <div>
                                                <p class="font-medium text-gray-800">
                                                    {{ card.tokenDetails.pan }}
                                                </p>
                                                <p class="text-sm text-gray-500">
                                                    Expira el
                                                    {{ card.tokenDetails.expiryMonth }}/{{
                                                        card.tokenDetails.expiryYear
                                                    }}
                                                </p>
                                            </div>
                                        </div>

                                        <input
                                            type="radio"
                                            :checked="
                                                form.paymentMethodToken === card.paymentMethodToken
                                            "
                                        />
                                    </div>

                                    <!-- Nueva tarjeta -->
                                    <div
                                        class="radio justify-between border border-sunka-sand p-4"
                                        :class="{
                                            'bg-gray-50': form.paymentMethodToken === 'nueva',
                                        }"
                                        @click="form.paymentMethodToken = 'nueva'"
                                    >
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
                                            >
                                                <iPlus class="w-4 h-4 text-gray-600" />
                                            </div>
                                            <p class="font-medium text-gray-800">
                                                Usar nueva tarjeta
                                            </p>
                                        </div>
                                        <input
                                            type="radio"
                                            :checked="form.paymentMethodToken === 'nueva'"
                                        />
                                    </div>
                                </div>
                            </template>

                            <!-- Si el método es YAPE -->
                            <template v-else-if="form.pago_metodo === 'yape'">
                                <p class="text-gray-500 text-sm">
                                    Escanea el QR con tu app Yape, realiza el pago y luego ingresa
                                    el código de operación. Nuestro equipo verificará la transacción
                                    y confirmará tu pago para continuar con el proceso de compra.
                                </p>

                                <div
                                    class="flex flex-col items-center gap-4 md:flex-row md:justify-center bg-[#742284] rounded-md p-4"
                                >
                                    <img
                                        :src="qrYapeUrl"
                                        alt="QR de Yape"
                                        class="w-48 h-48 rounded-xl"
                                    />

                                    <div
                                        class="text-white text-sm flex flex-col justify-center items-center text-center space-y-4"
                                    >
                                        <img
                                            :src="yapeLogo"
                                            alt="Yape logo"
                                            class="w-20 h-20 rounded-xl"
                                        />

                                        <div>
                                            <b>Empresa:</b> {{ empresa.nombre }}<br />
                                            <b>RUC:</b> {{ empresa.ruc }}<br />
                                            <b>Celular Yape:</b> {{ empresa.yape_number }}<br />
                                        </div>

                                        <a
                                            class="p-2 rounded-md bg-[#10cbb4] w-full"
                                            :href="`tel:+51${empresa.yape_number}`"
                                        >
                                            Añadir a contacto
                                        </a>
                                    </div>
                                </div>

                                <!-- Código de verificación -->
                                <JdInput
                                    label="Código de operación"
                                    :nec="true"
                                    v-model="form.pago_id"
                                    :error="errors.pago_id"
                                    placeholder="Ejemplo: 123456"
                                />
                            </template>
                        </div>

                        <div class="checkout-panel-back">
                            <JdButton text="Volver" tipo="2" @click="prevStep">
                                <template v-slot:iLeft>
                                    <ArrowLeft />
                                </template>
                            </JdButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Columna derecha: Resumen -->
        <aside class="checkout-summary">
            <div class="checkout-summary__heading">
                <div>
                    <h2>Resumen del pedido</h2>
                </div>
                <span>{{ items.length }} {{ items.length === 1 ? 'producto' : 'productos' }}</span>
            </div>

            <!-- Lista de productos -->
            <div class="checkout-summary__items">
                <div
                    v-for="item in items"
                    :key="item.id"
                    class="checkout-summary__item"
                >
                    <img
                        :src="item.foto"
                        alt="Producto"
                        class="checkout-summary__image"
                    />
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-800 leading-tight">
                            {{ item.nombre }}
                        </p>

                        <div class="flex justify-between">
                            <p class="text-xs text-gray-500">Cantidad: {{ item.cantidad }}</p>

                            <p class="text-sm font-semibold text-gray-700 mt-1">
                                S/
                                {{ (item.pu * item.cantidad).toFixed(2) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Totales -->
            <div class="checkout-totals">
                <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span>S/ {{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Costo de envío</span>
                    <span>
                        <span v-if="costoEnvio > 0">S/ {{ costoEnvio.toFixed(2) }}</span>
                        <span v-else>Gratis</span>
                    </span>
                </div>

                <div
                    class="checkout-total"
                >
                    <span>Total</span>
                    <span>S/ {{ total.toFixed(2) }}</span>
                </div>
            </div>

            <div class="checkout-summary__action-wrap">
                <p v-if="errors.general" class="checkout-summary__error">
                    {{ errors.general }}
                </p>
                <button
                    type="button"
                    class="checkout-summary__action"
                    :disabled="summaryActionLoading"
                    @click="summaryAction"
                >
                    <LoadingSpin
                        v-if="summaryActionLoading"
                        :rellenar="false"
                        :shadowBack="false"
                        scale="0.55"
                    />
                    <span class="checkout-summary__action-full">{{ summaryActionText }}</span>
                    <span class="checkout-summary__action-mobile">
                        {{ summaryActionMobileText }}
                    </span>
                    <span v-if="!summaryActionLoading">→</span>
                </button>
            </div>
        </aside>

        <div class="checkout-mobile-bar">
            <p v-if="errors.general" class="checkout-mobile-bar__error">
                {{ errors.general }}
            </p>
            <div class="checkout-mobile-bar__total">
                <small>{{ summaryMobileLabel }}</small>
                <strong>S/ {{ total.toFixed(2) }}</strong>
            </div>
            <button
                type="button"
                class="checkout-summary__action checkout-mobile-bar__action"
                :disabled="summaryActionLoading"
                @click="summaryAction"
            >
                <LoadingSpin
                    v-if="summaryActionLoading"
                    :rellenar="false"
                    :shadowBack="false"
                    scale="0.55"
                />
                <span>{{ summaryActionMobileText }}</span>
                <span v-if="!summaryActionLoading">→</span>
            </button>
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

    <LoadingSpin v-if="loading" />
</template>

<script>
import ArrowLeft from '../assets/icons/arrow-left.vue'
import JdButton from '../components/JdButton.vue'
import JdInput from '../components/JdInput.vue'
import JdSelect from '../components/JdSelect.vue'
import JdCheckBox from '../components/JdCheckBox.vue'
import JdRadio from '../components/JdRadio.vue'
import JdTextArea from '../components/JdTextArea.vue'
import JdSelectQuery from '../components/JdSelectQuery.vue'
import LoadingSpin from './LoadingSpin.vue'
import iPlus from '../assets/icons/plus.vue'

import visaUrl from '../assets/icons/visa.svg?url'
import mastercardUrl from '../assets/icons/mastercard.svg?url'
import dinersUrl from '../assets/icons/diners-club.svg?url'
import amexUrl from '../assets/icons/american-express.svg?url'
import genericUrl from '../assets/icons/card-generic.svg?url'
import qrYapeUrl from '../assets/qr-yape-eko-business.jpg?url'
import yapeLogo from '../assets/icons/yape-logo.svg?url'

import { Cart } from '../lib/cart.js'
import { CheckoutDraft, createCheckoutCartSignature } from '../lib/checkout-draft.js'
import { urls, get, post, patch } from '../lib/api.js'
import { genId } from '../lib/mine.js'

import KRGlue from '@lyracom/embedded-form-glue'

export default {
    inheritAttrs: false,
    components: {
        ArrowLeft,
        JdButton,
        JdInput,
        JdSelect,
        JdCheckBox,
        JdRadio,
        JdTextArea,
        JdSelectQuery,
        LoadingSpin,
        iPlus,
    },
    props: {
        empresa: { type: Object, default: () => ({}) },
        pago_metodos: { type: Array, default: () => [] },
        documentos_identidad: { type: Array, default: () => [] },
        entrega_tipos: { type: Array, default: () => [] },
        comprobante_tipos: { type: Array, default: () => [] },
    },
    data() {
        return {
            qrYapeUrl,
            yapeLogo,

            user: {},
            step: 1,
            paymentSuccess: false,
            loadingContinuarEntrega: false,
            loadingContinuarPago: false,
            loadingPagar: false,
            loading: false,

            form: {
                socio_datos: {
                    doc_tipo: 1,
                },

                entrega_tipo: 'envio',
                entrega_direccion_datos: {},

                comprobante_tipo: '03',

                pago_metodo: 'tarjeta',
                paymentMethodToken: 'nueva',
            },
            errors: {},
            items: [],

            ubigeos: [],
            ubigeosLoading: false,
            draftReady: false,
            draftSaveTimeout: null,
        }
    },
    computed: {
        subtotal() {
            return this.items.reduce((acc, item) => acc + item.pu * item.cantidad, 0)
        },
        costoEnvio() {
            return this.form.entrega_tipo === 'envio' ? 10 : 0
        },
        total() {
            return this.subtotal + this.costoEnvio
        },
        summaryActionText() {
            if (this.step === 1) return 'Continuar: elegir entrega'
            if (this.step === 2) return 'Continuar: elegir pago'
            if (this.form.pago_metodo === 'yape') return 'Procesar compra'
            return 'Ir a pagar'
        },
        summaryActionMobileText() {
            if (this.step !== 3) return 'Continuar'
            return this.form.pago_metodo === 'yape' ? 'Procesar compra' : 'Ir a pagar'
        },
        summaryActionLoading() {
            if (this.step === 1) return this.loadingContinuarEntrega
            if (this.step === 2) return this.loadingContinuarPago
            return this.loadingPagar
        },
        summaryMobileLabel() {
            const products = `${this.items.length} ${
                this.items.length === 1 ? 'producto' : 'productos'
            }`
            return `${products} · Paso ${this.step} de 3`
        },
    },
    watch: {
        form: {
            deep: true,
            handler() {
                this.scheduleDraftSave()
            },
        },
        step() {
            this.scheduleDraftSave()
        },
        paymentSuccess(value) {
            if (!value) return

            window.dispatchEvent(
                new CustomEvent('checkout:success', {
                    detail: { paymentMethod: this.form.pago_metodo },
                }),
            )
        },
    },
    async mounted() {
        this.injectarJsIzipay()
        this.items = Cart.get()

        if (this.items.length == 0) {
            CheckoutDraft.clear()
            window.location.href = '/tienda'
            return
        }

        await this.validateSession()
        this.restoreDraft()
        this.draftReady = true
        this.saveDraft()
    },
    beforeUnmount() {
        clearTimeout(this.draftSaveTimeout)
        if (this.draftReady && !this.paymentSuccess) this.saveDraft()
    },
    methods: {
        async summaryAction() {
            if (this.summaryActionLoading) return
            if (this.step === 1) {
                await this.continuarEntrega()
                return
            }
            if (this.step === 2) {
                await this.continuarPago()
                return
            }
            await this.pagar()
        },
        injectarJsIzipay() {
            const script = document.createElement('script')
            script.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/neon.js'
            document.head.appendChild(script)
        },
        async validateSession() {
            const user_token = localStorage.getItem('token')
            if (!user_token) return

            this.loading = true
            const res = await get(`${urls.account}/login`, null, user_token)
            this.loading = false

            if (res.code != 0) return

            this.user = res.data
            this.form.socio_datos.nombres = this.user.nombres
            this.form.socio_datos.apellidos = this.user.apellidos
            this.form.socio_datos.doc_tipo = this.user.doc_tipo
            this.form.socio_datos.doc_numero = this.user.doc_numero
            this.form.socio_datos.correo = this.user.correo
            this.form.socio_datos.telefono = this.user.telefono1
        },

        draftContext() {
            return {
                userId: this.user.id ? String(this.user.id) : 'guest',
                cartSignature: createCheckoutCartSignature(this.items),
            }
        },
        scheduleDraftSave() {
            if (!this.draftReady || this.paymentSuccess) return
            clearTimeout(this.draftSaveTimeout)
            this.draftSaveTimeout = setTimeout(() => this.saveDraft(), 250)
        },
        saveDraft() {
            if (!this.draftReady) return
            CheckoutDraft.save({
                ...this.draftContext(),
                step: this.step,
                form: this.form,
            })
        },
        restoreDraft() {
            const draft = CheckoutDraft.get(this.draftContext())
            if (!draft?.form) return

            const saved = draft.form
            const validDocumentTypes = this.documentos_identidad
                .filter((item) => Number(item.id) !== 6)
                .map((item) => String(item.id))
            const validDeliveryTypes = this.entrega_tipos.map((item) => String(item.id))
            const validReceiptTypes = this.comprobante_tipos
                .filter((item) => item.id !== 'NV')
                .map((item) => String(item.id))
            const validPaymentMethods = this.pago_metodos.map((item) => String(item.id))

            Object.assign(this.form.socio_datos, saved.socio_datos || {}, { privacidad: false })

            if (!validDocumentTypes.includes(String(this.form.socio_datos.doc_tipo))) {
                this.form.socio_datos.doc_tipo = this.documentos_identidad.find(
                    (item) => Number(item.id) !== 6,
                )?.id
            }

            if (validDeliveryTypes.includes(String(saved.entrega_tipo))) {
                this.form.entrega_tipo = saved.entrega_tipo
            }

            this.form.direccion_nombre = saved.direccion_nombre || ''
            this.form.new_direccion = Boolean(saved.new_direccion)
            this.form.entrega_ubigeo = saved.entrega_ubigeo ?? null
            this.form.direccion_entrega = saved.direccion_entrega || ''
            this.form.entrega_direccion_datos = {
                ...this.form.entrega_direccion_datos,
                ...(saved.entrega_direccion_datos || {}),
            }

            const savedAddressExists = (this.user.direcciones || []).some(
                (item) => String(item.id) === String(saved.entrega_direccion_id),
            )
            this.form.entrega_direccion_id = savedAddressExists
                ? saved.entrega_direccion_id
                : null

            const savedDate = saved.fecha_entrega
            const now = new Date()
            const today = [
                now.getFullYear(),
                String(now.getMonth() + 1).padStart(2, '0'),
                String(now.getDate()).padStart(2, '0'),
            ].join('-')
            this.form.fecha_entrega = savedDate && savedDate >= today ? savedDate : null

            if (this.form.entrega_direccion_datos.ubigeo1) {
                this.ubigeos = [{ ...this.form.entrega_direccion_datos.ubigeo1 }]
            }

            if (validReceiptTypes.includes(String(saved.comprobante_tipo))) {
                this.form.comprobante_tipo = saved.comprobante_tipo
            }
            this.form.comprobante_ruc = saved.comprobante_ruc || ''
            this.form.comprobante_razon_social = saved.comprobante_razon_social || ''

            if (validPaymentMethods.includes(String(saved.pago_metodo))) {
                this.form.pago_metodo = saved.pago_metodo
            }

            this.form.paymentMethodToken = null
            this.form.pago_id = ''
            this.step = 1
        },

        validateForm1() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''))

            if (
                !this.form.socio_datos.correo ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.socio_datos.correo)
            )
                this.errors.correo = 'Ingrese un correo válido.'
            if (!this.form.socio_datos.telefono) this.errors.telefono = 'Este campo es obligatorio.'
            if (!this.form.socio_datos.nombres) this.errors.nombres = 'Este campo es obligatorio.'
            if (!this.form.socio_datos.doc_tipo)
                this.errors.doc_tipo = 'Seleccione un tipo de documento.'
            if (!this.form.socio_datos.doc_numero)
                this.errors.doc_numero = 'Este campo es obligatorio.'
            if (!this.form.socio_datos.privacidad)
                this.errors.privacidad = 'Este campo es obligatorio.'

            return Object.values(this.errors).every((e) => !e)
        },
        async continuarEntrega() {
            if (!this.validateForm1()) return

            if (this.user.id) {
                const send = {
                    id: this.user.id,
                    tipo: 2,
                    comes_from: 'ecommerce',
                    user_token: localStorage.getItem('token'),
                    nombres: this.form.socio_datos.nombres,
                    doc_tipo: this.form.socio_datos.doc_tipo,
                    doc_numero: this.form.socio_datos.doc_numero,
                    correo: this.form.socio_datos.correo,
                    telefono1: this.form.socio_datos.telefono,
                }

                this.loadingContinuarEntrega = true
                await patch('account', send)
                this.loadingContinuarEntrega = false
            }

            this.step = 2
            this.scrollToForm('seccionForm2')
        },

        validateForm2() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''))

            if (this.form.entrega_tipo === 'envio') {
                this.form.fecha_entrega = null

                if (this.user.id) {
                    if (this.form.new_direccion) {
                        if (!this.form.direccion_nombre)
                            this.errors.direccion_nombre = 'Este campo es obligatorio.'
                    } else {
                        if (!this.form.entrega_direccion_id)
                            this.errors.entrega_direccion_id = 'Seleccione una dirección guardada.'
                    }
                }

                if (!this.form.entrega_ubigeo)
                    this.errors.entrega_ubigeo = 'Este campo es obligatorio.'
                if (!this.form.direccion_entrega)
                    this.errors.direccion_entrega = 'Este campo es obligatorio.'
                if (!this.form.entrega_direccion_datos.referencia)
                    this.errors.entrega_direccion_datos_referencia = 'Este campo es obligatorio.'
            }

            if (this.form.entrega_tipo === 'retiro') {
                this.form.new_direccion = false

                this.form.entrega_direccion_id = null
                this.form.direccion_nombre = null

                this.form.entrega_ubigeo = null
                this.form.direccion_entrega = null
                this.form.entrega_direccion_datos.numero = null
                this.form.entrega_direccion_datos.piso = null
                this.form.entrega_direccion_datos.referencia = null

                if (!this.form.fecha_entrega)
                    this.errors.fecha_entrega = 'Este campo es obligatorio.'

                if (this.form.fecha_entrega) {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)

                    const [year, month, day] = this.form.fecha_entrega.split('-')

                    const selectedDate = new Date(Number(year), Number(month) - 1, Number(day))

                    if (selectedDate < today) {
                        this.errors.fecha_entrega = 'La fecha no puede ser anterior a hoy.'
                    }
                }
            }

            return Object.values(this.errors).every((e) => !e)
        },
        async continuarPago() {
            if (!this.validateForm2()) return

            if (this.user.id) {
                if (this.form.new_direccion) {
                    const direcciones = JSON.parse(JSON.stringify(this.user.direcciones))
                    const newDireccionId = genId()
                    direcciones.push({
                        id: newDireccionId,
                        nombre: this.form.direccion_nombre,
                        ubigeo: this.form.entrega_ubigeo,
                        ubigeo1: this.form.entrega_direccion_datos.ubigeo1,
                        direccion: this.form.direccion_entrega,
                        numero: this.form.entrega_direccion_datos.numero,
                        piso: this.form.entrega_direccion_datos.piso,
                        referencia: this.form.entrega_direccion_datos.referencia,
                    })
                    const send = {
                        id: this.user.id,
                        tipo: 2,
                        comes_from: 'ecommerce',
                        user_token: localStorage.getItem('token'),
                        direcciones,
                    }
                    this.loadingContinuarPago = true
                    const res = await patch('account', send)
                    this.loadingContinuarPago = false
                    if (res.code == 0) {
                        this.user.direcciones = res.data.direcciones
                        this.form.new_direccion = false
                        this.form.entrega_direccion_id = newDireccionId
                    }
                }
                if (!this.user.wallet) {
                    await this.getCustomerWallet()
                }
            }

            this.selectDefaultPaymentMethod()
            this.step = 3
            this.scrollToForm('seccionForm3')
        },

        validarForm3() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''))

            if (this.form.comprobante_tipo === '01') {
                if (!this.form.comprobante_ruc || !/^\d{11}$/.test(this.form.comprobante_ruc))
                    this.errors.comprobante_ruc = 'El RUC debe tener 11 dígitos numéricos.'
                if (!this.form.comprobante_razon_social)
                    this.errors.comprobante_razon_social = 'Este campo es obligatorio.'
            }

            if (this.form.pago_metodo == 'tarjeta') {
                if (!this.form.paymentMethodToken)
                    this.errors.paymentMethodToken = 'Seleccione una tarjeta.'
            } else if (this.form.pago_metodo == 'yape') {
                if (!this.form.pago_id) this.errors.pago_id = 'Este campo es obligatorio.'
            }

            return Object.values(this.errors).every((e) => !e)
        },
        shapeDatos() {
            this.form.tipo = 2
            this.form.origin = 'ecommerce'
            this.form.fecha = new Date().toISOString().split('T')[0]
            this.form.socio = this.user.id

            this.form.pago_condicion = '1'
            this.form.moneda = 'PEN'
            this.form.monto = this.total.toFixed(2)

            this.form.socio_pedido_items = this.items
            this.form.entrega_costo = this.costoEnvio

            if (this.form.pago_metodo == 'yape') {
                this.form.codigo = genId()
            }
        },
        async pagar() {
            if (!this.validarForm3()) return

            if (this.form.pago_metodo == 'tarjeta') {
                this.pagarConTarjeta()
            } else if (this.form.pago_metodo == 'yape') {
                this.pagarConYape()
            }
        },
        async pagarConTarjeta() {
            const send = {
                monto: this.total.toFixed(2),
                correo: this.form.socio_datos.correo,
                user_id: this.user.id,
                paymentMethodToken: this.form.paymentMethodToken,
            }

            this.loadingPagar = true
            const res = await post(`${urls.izipay}/create-payment`, send)
            this.loadingPagar = false

            if (res.code == 1) {
                this.errors.general = res.msg
            } else if (res.code == 0) {
                this.form.codigo = res.orderId
                this.loadingPagar = true
                const endpoint = 'https://api.micuentaweb.pe'
                const publicKey = import.meta.env.PUBLIC_IZIPAY_PUBLIC_KEY

                const { KR } = await KRGlue.loadLibrary(endpoint, publicKey)

                await KR.setFormConfig({
                    formToken: res.data.formToken,
                    'kr-language': 'es-PE',
                })

                await KR.onFormCreated(() => {
                    this.loadingPagar = false
                })

                await KR.onSubmit(async (paymentData) => {
                    this.shapeDatos()

                    const res1 = await post(`${urls.izipay}/validate-payment`, {
                        paymentData,
                        socio_pedido: this.form,
                    })

                    if (res1.code > 0) {
                        KR.closePopin()
                        this.errors.general = res1.msg
                    } else if (res1.code == 0) {
                        this.paymentSuccess = true
                        this.form.id = res1.data.id
                        this.form.codigo = res.data.codigo
                        Cart.clear()
                        CheckoutDraft.clear()
                        KR.closePopin()

                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        })
                    }

                    return false
                })

                await KR.renderElements('#myPaymentForm')

                await KR.openPopin()
            }
        },
        async pagarConYape() {
            this.shapeDatos()

            this.loadingPagar = true
            const res = await post('socio_pedidos', this.form)
            this.loadingPagar = false

            if (res.code < 0) {
                this.errors.general = 'Algo salió mal'
            }
            if (res.code > 0) {
                this.errors.general = res.msg
            } else if (res.code == 0) {
                this.paymentSuccess = true
                this.form.id = res.data.id
                this.form.codigo = res.data.codigo
                Cart.clear()
                CheckoutDraft.clear()

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                })
            }
        },

        prevStep() {
            if (this.step > 1) this.step--
            this.errors = {}

            if (this.step === 1) {
                this.scrollToForm('seccionForm1')
            }
            if (this.step === 2) {
                this.scrollToForm('seccionForm2')
            }
            if (this.step === 3) {
                this.scrollToForm('seccionForm3')
            }
        },
        scrollToForm(id) {
            setTimeout(() => {
                const el = this.$refs[id]
                if (el) {
                    const header = document.getElementById('site-header-main')
                    const headerBottom = header?.getBoundingClientRect().bottom || 0
                    const safeOffset = headerBottom + 20
                    const targetTop = el.getBoundingClientRect().top + window.scrollY - safeOffset
                    window.scrollTo({ top: targetTop, behavior: 'smooth' })
                }
            }, 100)
        },

        async loadUbigeos(txtBuscar) {
            if (!txtBuscar) {
                this.ubigeos.length = 0
                return
            }

            const qry = {
                fltr: {
                    distrito: { op: 'Contiene', val: txtBuscar },
                },
                cols: ['departamento', 'provincia', 'distrito', 'nombre'],
            }

            this.ubigeosLoading = true
            const res = await get('ubigeos', { qry }, localStorage.getItem('token'))
            this.ubigeosLoading = false

            if (res.code !== 0) return

            this.ubigeos = res.data
        },
        setUbigeo(item) {
            this.form.entrega_direccion_datos.ubigeo1 = item
        },

        setDireccion(item) {
            if (!item) {
                this.cleanDireccion()
                return
            }

            this.ubigeos = [{ ...item.ubigeo1 }]

            this.form.entrega_ubigeo = item.ubigeo1.id
            this.form.direccion_entrega = item.direccion
            this.form.entrega_direccion_datos.numero = item.numero
            this.form.entrega_direccion_datos.piso = item.piso
            this.form.entrega_direccion_datos.referencia = item.referencia
            this.form.entrega_direccion_datos.ubigeo1 = item.ubigeo1
        },
        cleanDireccion() {
            this.ubigeos = []

            this.form.direccion_nombre = null
            this.form.entrega_direccion_id = null

            this.form.entrega_ubigeo = ''
            this.form.direccion_entrega = ''
            this.form.entrega_direccion_datos.numero = ''
            this.form.entrega_direccion_datos.piso = ''
            this.form.entrega_direccion_datos.referencia = ''
            this.form.entrega_direccion_datos.ubigeo1 = null
        },

        async getCustomerWallet() {
            this.loading = true
            const res = await get(
                `${urls.account}/customer-wallet/${this.user.id}`,
                null,
                localStorage.getItem('token'),
            )
            this.loading = false

            if (res.code == 0) {
                this.user.wallet = res.data.tokens
                this.selectDefaultPaymentMethod()
            }
        },

        selectDefaultPaymentMethod() {
            if (!this.user.id) {
                this.form.paymentMethodToken = 'nueva'
                return
            }

            const cards = this.user.wallet || []
            const selectedCardExists = cards.some(
                (card) => card.paymentMethodToken === this.form.paymentMethodToken,
            )

            if (selectedCardExists) return

            if (cards.length === 1) {
                this.form.paymentMethodToken = cards[0].paymentMethodToken
                return
            }

            const favoriteCard = cards.find((card) => {
                const favorite =
                    card.favorite ??
                    card.isFavorite ??
                    card.is_favorite ??
                    card.default ??
                    card.isDefault

                return (
                    favorite === true ||
                    favorite === 1 ||
                    favorite === '1' ||
                    favorite === 'true'
                )
            })

            this.form.paymentMethodToken =
                favoriteCard?.paymentMethodToken || cards[0]?.paymentMethodToken || 'nueva'
        },

        getCardBrandIcon(brand) {
            if (!brand) return genericUrl
            const b = brand.toUpperCase().trim()
            const map = {
                VISA: visaUrl,
                MASTERCARD: mastercardUrl,
                'DINERS CLUB': dinersUrl,
                DINERS: dinersUrl,
                'AMERICAN EXPRESS': amexUrl,
                AMEX: amexUrl,
            }
            return map[b] || genericUrl
        },
    },
}
</script>

<style scoped>
.checkout-layout {
    --checkout-sticky-offset: 124px;

    display: grid;
    grid-template-columns: minmax(0, 1fr) 370px;
    align-items: start;
    gap: 26px;
    width: min(100%, 1280px);
    margin: 0 auto;
    color: var(--sunka-ink);
}

.checkout-workspace {
    min-width: 0;
}

.checkout-steps {
    display: grid;
    grid-template-columns: auto 1fr auto 1fr auto;
    align-items: center;
    margin-bottom: 16px;
    padding: 15px 22px;
    border: 1px solid var(--sunka-sand);
    border-radius: 13px;
    background: rgba(255, 253, 248, 0.76);
}

.checkout-step {
    display: flex;
    align-items: center;
    gap: 9px;
    color: var(--sunka-stone);
    transition: color 0.2s ease;
}

.checkout-step.is-active,
.checkout-step.is-done {
    color: var(--sunka-forest);
}

.checkout-step__number {
    display: grid;
    width: 30px;
    height: 30px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid var(--sunka-sand);
    border-radius: 50%;
    background: var(--sunka-white);
    font-size: 10px;
    font-weight: 700;
    transition: all 0.2s ease;
}

.checkout-step__number.is-current {
    border-color: var(--sunka-brass);
    background: var(--sunka-brass);
    color: var(--sunka-white);
    box-shadow: 0 0 0 4px rgba(184, 138, 61, 0.12);
}

.checkout-step__number.is-complete {
    border-color: var(--sunka-forest);
    background: var(--sunka-forest);
    color: var(--sunka-white);
}

.checkout-step__label {
    font-size: 11px;
    font-weight: 650;
    letter-spacing: 0.02em;
}

.checkout-step__line {
    height: 1px;
    margin: 0 14px;
    background: var(--sunka-sand);
    transition: background 0.2s ease;
}

.checkout-step__line.is-complete {
    background: var(--sunka-forest);
}

.checkout-panels {
    display: grid;
    gap: 14px;
}

.checkout-card {
    display: grid;
    gap: 25px;
    padding: 28px 30px 30px;
    border: 1px solid var(--sunka-sand);
    border-radius: 16px;
    background: var(--sunka-white);
    box-shadow: 0 12px 30px rgba(35, 29, 24, 0.05);
}

.checkout-card__heading {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--sunka-sand);
}

.checkout-card__heading > span {
    display: grid;
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    place-items: center;
    border-radius: 11px;
    background: var(--sunka-forest);
    color: var(--sunka-brass-light);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
}

.checkout-card__heading p,
.checkout-card__heading h2 {
    margin: 0;
}

.checkout-card__heading p {
    margin-bottom: 2px;
    color: var(--sunka-stone);
    font-size: 9px;
    font-weight: 650;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.checkout-card__heading h2 {
    color: var(--sunka-forest);
    font-size: 20px;
    font-weight: 650;
}

.checkout-completed {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    padding: 16px 18px;
    border-left: 3px solid var(--sunka-brass);
    border-radius: 0 10px 10px 0;
    background: var(--sunka-cream);
    color: #5f584f;
    font-size: 12px;
    line-height: 1.65;
}

.checkout-completed button {
    color: var(--sunka-brass);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.checkout-panel-back {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
}

.checkout-summary {
    position: sticky;
    top: var(--checkout-sticky-offset);
    overflow: hidden;
    height: fit-content;
    padding: 20px 24px 18px;
    border-radius: 16px;
    background: var(--sunka-forest);
    color: var(--sunka-white);
    box-shadow: 0 18px 38px rgba(13, 35, 23, 0.18);
}

.checkout-summary__heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
}

.checkout-summary__heading p,
.checkout-summary__heading h2 {
    margin: 0;
}

.checkout-summary__heading p {
    margin-bottom: 3px;
    color: rgba(255, 253, 248, 0.54);
    font-size: 8px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.checkout-summary__heading h2 {
    font-size: 15px;
}

.checkout-summary__heading > span {
    padding: 6px 9px;
    border: 1px solid rgba(212, 173, 96, 0.42);
    border-radius: 999px;
    color: var(--sunka-brass-light);
    font-size: 8px;
    white-space: nowrap;
}

.checkout-summary__items {
    display: grid;
    gap: 0;
    max-height: 330px;
    overflow-y: auto;
    margin: 17px 0 18px;
    scrollbar-color: rgba(255, 255, 255, 0.22) transparent;
    scrollbar-width: thin;
}

.checkout-summary__item {
    display: flex;
    gap: 12px;
    padding: 13px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.checkout-summary__image {
    width: 58px;
    height: 58px;
    flex: 0 0 auto;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 8px;
    background: var(--sunka-white);
    object-fit: cover;
}

.checkout-summary__item p {
    color: rgba(255, 253, 248, 0.72);
}

.checkout-summary__item p:first-child {
    color: var(--sunka-white);
}

.checkout-totals {
    display: grid;
    gap: 9px;
    color: rgba(255, 253, 248, 0.68);
    font-size: 11px;
}

.checkout-totals > div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
}

.checkout-total {
    align-items: center;
    margin-top: 5px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.16);
    color: var(--sunka-white);
    font-size: 14px;
    font-weight: 650;
}

.checkout-total span:last-child {
    color: var(--sunka-white);
    font-size: 23px;
}

.checkout-summary__assurance {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 18px;
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.04);
}

.checkout-summary__assurance > span {
    display: grid;
    width: 25px;
    height: 25px;
    flex: 0 0 auto;
    place-items: center;
    border-radius: 50%;
    background: rgba(212, 173, 96, 0.16);
    color: var(--sunka-brass-light);
    font-size: 11px;
}

.checkout-summary__assurance p,
.checkout-summary__assurance strong {
    display: block;
    margin: 0;
}

.checkout-summary__assurance p {
    color: rgba(255, 253, 248, 0.54);
    font-size: 8px;
}

.checkout-summary__assurance strong {
    margin-bottom: 1px;
    color: rgba(255, 253, 248, 0.84);
    font-size: 9px;
}

.checkout-summary__action-wrap {
    display: grid;
    gap: 7px;
    margin-top: 17px;
}

.checkout-summary__action {
    display: inline-flex;
    width: 100%;
    min-height: 48px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 1px solid var(--sunka-brass);
    border-radius: 8px;
    padding: 0 18px;
    background: var(--sunka-brass);
    color: var(--sunka-white);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.18s ease;
}

.checkout-summary__action:hover:not(:disabled) {
    background: #c69a50;
}

.checkout-summary__action:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

.checkout-summary__error {
    margin: 0;
    color: #efc1b5;
    font-size: 10px;
    line-height: 1.35;
    text-align: center;
}

.checkout-mobile-bar,
.checkout-summary__action-mobile {
    display: none;
}

.checkout-success {
    width: min(100%, 840px);
    margin: 0 auto;
    padding: 42px 0 88px;
}

.checkout-success__card {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 58px 64px 54px;
    border: 1px solid var(--sunka-sand);
    border-radius: 18px;
    background: var(--sunka-white);
    color: var(--sunka-ink);
    text-align: center;
    box-shadow: 0 22px 50px rgba(35, 29, 24, 0.09);
}

.checkout-success__card::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 4px;
    background: var(--sunka-brass);
    content: '';
}

.checkout-success__card::after {
    position: absolute;
    top: -120px;
    right: -110px;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: rgba(184, 138, 61, 0.06);
    content: '';
}

.checkout-success__icon {
    position: relative;
    z-index: 1;
    display: grid;
    width: 60px;
    height: 60px;
    place-items: center;
    margin-bottom: 22px;
    border-radius: 50%;
    background: var(--sunka-forest);
    color: var(--sunka-brass-light);
    font-size: 27px;
    box-shadow: 0 0 0 8px rgba(22, 62, 40, 0.07);
}

.checkout-success__eyebrow {
    position: relative;
    z-index: 1;
    margin: 0 0 10px;
    color: var(--sunka-brass);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
}

.checkout-success__card h2 {
    position: relative;
    z-index: 1;
    margin: 0;
    color: var(--sunka-forest);
    font-family: var(--font-heading);
    font-size: clamp(28px, 4vw, 38px);
    font-weight: 650;
    line-height: 1.1;
}

.checkout-success__lead {
    position: relative;
    z-index: 1;
    max-width: 540px;
    margin: 18px 0 0;
    color: var(--sunka-stone);
    font-size: 14px;
    line-height: 1.75;
}

.checkout-success__order {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 4px;
    width: min(100%, 520px);
    margin-top: 28px;
    padding: 16px 20px;
    border: 1px solid var(--sunka-sand);
    border-radius: 10px;
    background: var(--sunka-cream);
}

.checkout-success__order span {
    color: var(--sunka-stone);
    font-size: 9px;
    font-weight: 650;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.checkout-success__order strong {
    overflow-wrap: anywhere;
    color: var(--sunka-forest);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.04em;
}

.checkout-success__notice {
    position: relative;
    z-index: 1;
    width: min(100%, 520px);
    margin-top: 16px;
    padding: 16px 18px;
    border-left: 3px solid var(--sunka-brass);
    border-radius: 0 9px 9px 0;
    background: rgba(184, 138, 61, 0.08);
    text-align: left;
}

.checkout-success__notice span {
    display: block;
    margin-bottom: 4px;
    color: var(--sunka-brass);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.checkout-success__notice p {
    margin: 0;
    color: var(--sunka-stone);
    font-size: 12px;
    line-height: 1.6;
}

.checkout-success__actions {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 30px;
}

.checkout-success__action {
    display: inline-flex;
    min-height: 46px;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    border-radius: 8px;
    padding: 0 22px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.03em;
    transition: 0.18s ease;
}

.checkout-success__action.is-primary {
    border-color: var(--sunka-brass);
    background: var(--sunka-brass);
    color: var(--sunka-white);
}

.checkout-success__action.is-primary:hover {
    background: #c69a50;
}

.checkout-success__action.is-secondary {
    border-color: var(--sunka-sand);
    background: transparent;
    color: var(--sunka-forest);
}

.checkout-success__action.is-secondary:hover {
    border-color: var(--sunka-forest);
}

.checkout-card :deep(.button) {
    min-height: 43px;
    padding: 0 18px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 650;
}

.checkout-card :deep(.button1) {
    border-color: var(--sunka-brass);
    background: var(--sunka-brass);
    color: var(--sunka-white);
}

.checkout-card :deep(.button1:hover) {
    background: #c69a50;
}

.checkout-card :deep(.button2) {
    border-color: var(--sunka-sand);
    color: var(--sunka-forest);
}

@media (max-width: 980px) {
    .checkout-layout {
        grid-template-columns: 1fr;
    }

    .checkout-summary {
        position: relative;
        top: auto;
    }
}

@media (min-width: 981px) and (max-width: 1023px) {
    .checkout-layout {
        --checkout-sticky-offset: 108px;
    }
}

@media (max-width: 720px) {
    .checkout-layout {
        padding-bottom: 0;
    }

    .checkout-summary > .checkout-summary__action-wrap {
        display: none;
    }

    .checkout-panel-back :deep(.button) {
        width: 100%;
    }

    .checkout-mobile-bar {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 30;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
        border: 1px solid var(--sunka-sand);
        border-bottom: 0;
        border-radius: 14px 14px 0 0;
        background: var(--sunka-white);
        color: var(--sunka-ink);
        box-shadow: 0 -8px 24px rgba(13, 35, 23, 0.14);
    }

    .checkout-mobile-bar__error {
        grid-column: 1 / -1;
        margin: 0;
        color: var(--sunka-danger);
        font-size: 9px;
        text-align: center;
    }

    .checkout-mobile-bar__total {
        display: grid;
        min-width: 0;
        gap: 2px;
    }

    .checkout-mobile-bar__total small {
        overflow: hidden;
        color: var(--sunka-stone);
        font-size: 8px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .checkout-mobile-bar__total strong {
        color: var(--sunka-forest);
        font-size: 19px;
    }

    .checkout-mobile-bar__action {
        width: auto;
        min-width: 132px;
        min-height: 44px;
        padding: 0 16px;
        white-space: nowrap;
        box-shadow: none;
    }
}

@media (max-width: 640px) {
    .checkout-steps {
        padding: 12px 13px;
    }

    .checkout-step {
        justify-content: center;
    }

    .checkout-step__label {
        display: none;
    }

    .checkout-step__line {
        margin: 0 8px;
    }

    .checkout-card {
        gap: 21px;
        padding: 22px 18px 24px;
    }

    .checkout-card__heading {
        padding-bottom: 15px;
    }

    .checkout-card__heading h2 {
        font-size: 18px;
    }

    .checkout-card :deep(.grid.md\:grid-cols-2) {
        grid-template-columns: 1fr;
    }

    .checkout-card :deep(.col-span-2) {
        grid-column: span 1;
    }

    .checkout-card :deep(.flex.justify-between) {
        gap: 12px;
    }

    .checkout-success {
        padding-top: 16px;
    }

    .checkout-success__card {
        padding: 42px 20px 36px;
    }

    .checkout-success__actions {
        width: 100%;
        flex-direction: column;
    }

    .checkout-success__action {
        width: 100%;
    }
}
</style>
