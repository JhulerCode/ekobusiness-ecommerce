<template>
    <section class="max-w-6xl mx-auto px-4 py-12 gap-10" v-if="paymentSuccess == true">
        <div
            class="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-md border border-gray-100 animate-fade-in"
            v-if="form.pago_metodo == 'tarjeta'"
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

            <h2 class="text-2xl font-semibold text-gray-800 mb-2">¡Pago confirmado!</h2>

            <p class="text-gray-600 mb-6 max-w-md">
                Tu pago ha sido procesado exitosamente. En unos momentos recibirás un correo con los
                detalles de tu compra.
            </p>

            <div class="flex gap-4">
                <a href="/" class="button button2"> Ir al inicio </a>
                <a :href="`/pedido/${form.id}`" class="button button1"> Ver mi pedido </a>
            </div>
        </div>

        <div
            class="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-md border border-gray-100 animate-fade-in"
            v-if="form.pago_metodo == 'yape'"
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

            <h2 class="text-2xl font-semibold text-gray-800 mb-2">¡Pedido recibido!</h2>

            <p class="text-gray-600 mb-6 max-w-md">
                Hemos recibido tu pedido exitosamente. En unos momentos recibirás un correo con los
                detalles de tu pedido. <br /><br />
                Está pendiente de confirmar el pago realizado por Yape, nuestro equipo validará la
                operación en breve.
            </p>

            <div class="flex gap-4">
                <a href="/" class="button button2"> Ir al inicio </a>
                <a :href="`/pedido/${form.id}`" class="button button1"> Ver estado del pedido </a>
            </div>
        </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10" v-else>
        <!-- Columna izquierda: pasos -->
        <div class="md:col-span-2 flex md:flex-row flex-col gap-10">
            <!-- Encabezado -->
            <div class="md:sticky md:top-20 md:h-fit flex gap-2 justify-between md:flex-col">
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
                    class="h-[2px] w-20 my-5 md:w-[2px] md:h-20 md:mx-5 md:my-0"
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
                    class="h-[2px] w-20 my-5 md:w-[2px] md:h-20 md:mx-5 md:my-0"
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
                                    y declaro haber sido informado sobre el tratamiento de mis datos
                                    personales.
                                </span>
                            </JdCheckBox>
                        </div>

                        <!-- Botones -->
                        <div class="flex justify-end">
                            <JdButton
                                text="Ir a la Entrega"
                                @click="continuarEntrega"
                                :loading="loadingContinuarEntrega"
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

                        <!-- Botones -->
                        <div class="flex justify-between">
                            <JdButton text="Volver" tipo="2" @click="prevStep">
                                <template v-slot:iLeft>
                                    <ArrowLeft />
                                </template>
                            </JdButton>

                            <JdButton
                                text="Ir al Pago"
                                @click="continuarPago"
                                :loading="loadingContinuarPago"
                            >
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
                                <p v-if="form.entrega_direccion_datos.entrega_ubigeo1">
                                    <span class="font-medium">Distrito:</span>
                                    {{ form.entrega_direccion_datos.entrega_ubigeo1.nombre }}
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
                                        class="radio justify-between p-4 rounded-xl border border-gray-200"
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
                                                        card.tokenDetails.effectiveBrand
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
                                        class="radio justify-between p-4 rounded-xl border border-gray-200"
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
                                    class="flex flex-col items-center gap-4 md:flex-row md:justify-between bg-[#742284] rounded-md p-4"
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
                                            <b>Empresa:</b> {{ companyName }}<br />
                                            <b>RUC:</b> {{ companyRUC }}<br />
                                            <b>Celular Yape:</b> {{ yapeNumber }}<br />
                                        </div>

                                        <a
                                            class="p-2 rounded-md bg-[#10cbb4] w-full"
                                            :href="`tel:+51${yapeNumber}`"
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

                        <!-- Botones -->
                        <div class="flex justify-between">
                            <JdButton text="Volver" tipo="2" @click="prevStep">
                                <template v-slot:iLeft>
                                    <ArrowLeft />
                                </template>
                            </JdButton>

                            <div>
                                <JdButton
                                    text="Ir a pagar"
                                    @click="pagar"
                                    :loading="loadingPagar"
                                />

                                <p v-if="errors.general" class="input-error">
                                    {{ errors.general }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Columna derecha: Resumen -->
        <div class="border border-gray-200 rounded-2xl p-6 h-fit sticky top-20 shadow-sm">
            <h2 class="text-xl font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-3">
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
            <div class="space-y-2 text-sm text-gray-700">
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
                    class="flex justify-between text-gray-900 text-lg font-semibold mt-4 border-t border-gray-300 pt-4"
                >
                    <span>Total</span>
                    <span>S/ {{ total.toFixed(2) }}</span>
                </div>
            </div>
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
import ArrowLeft from "../assets/icons/arrow-left.vue";
import ArrowRight from "../assets/icons/arrow-right.vue";
import JdButton from "../components/JdButton.vue";
import JdInput from "../components/JdInput.vue";
import JdSelect from "../components/JdSelect.vue";
import JdCheckBox from "../components/JdCheckBox.vue";
import JdRadio from "../components/JdRadio.vue";
import JdTextArea from "../components/JdTextArea.vue";
import JdSelectQuery from "../components/JdSelectQuery.vue";
import LoadingSpin from "./LoadingSpin.vue";
import iPlus from "../assets/icons/plus.vue";

import visaUrl from "../assets/icons/visa.svg?url";
import mastercardUrl from "../assets/icons/mastercard.svg?url";
import dinersUrl from "../assets/icons/diners-club.svg?url";
import amexUrl from "../assets/icons/american-express.svg?url";
import genericUrl from "../assets/icons/card-generic.svg?url";
import qrYapeUrl from "../assets/qr-yape-eko-business.jpg?url";
import yapeLogo from "../assets/icons/yape-logo.svg?url";

import { yapeNumber, companyName, companyRUC } from "../lib/empresa.js";
import { Cart } from "../lib/cart.js";
import { urls, get, post, patch } from "../lib/api.js";
import { genId } from "../lib/mine.js";

import KRGlue from "@lyracom/embedded-form-glue";

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
        LoadingSpin,
        iPlus,
    },
    props: {
        pago_metodos: { type: Array, default: () => [] },
        doc_tipos: { type: Array, default: () => [] },
        entrega_tipos: { type: Array, default: () => [] },
        comprobante_tipos: { type: Array, default: () => [] },
    },
    data() {
        return {
            yapeNumber,
            companyName,
            companyRUC,
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
                    doc_tipo: "DNI",
                },

                entrega_tipo: "envio",
                entrega_direccion_datos: {},

                comprobante_tipo: "03",

                pago_metodo: "tarjeta",
            },
            errors: {},
            items: [],

            ubigeos: [],
            ubigeosLoading: false,
        };
    },
    computed: {
        subtotal() {
            return this.items.reduce((acc, item) => acc + item.pu * item.cantidad, 0);
        },
        costoEnvio() {
            return this.form.entrega_tipo === "envio" ? 10 : 0;
        },
        total() {
            return this.subtotal + this.costoEnvio;
        },
    },
    mounted() {
        this.injectarJsIzipay();
        this.validateSession();

        this.items = Cart.get();

        if (this.items.length == 0) {
            window.location.href = "/cart";
            return;
        }
    },
    methods: {
        injectarJsIzipay() {
            const script = document.createElement("script");
            script.src = "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/neon.js";
            document.head.appendChild(script);
        },
        async validateSession() {
            const user_token = localStorage.getItem("token");
            if (!user_token) return;

            this.loading = true;
            const res = await get(`${urls.account}/verify`, null, user_token);
            this.loading = false;

            if (res.code != 0) return;

            this.user = res.data;
            this.form.socio_datos.nombres = this.user.nombres;
            this.form.socio_datos.apellidos = this.user.apellidos;
            this.form.socio_datos.doc_tipo = this.user.doc_tipo;
            this.form.socio_datos.doc_numero = this.user.doc_numero;
            this.form.socio_datos.correo = this.user.correo;
            this.form.socio_datos.telefono = this.user.telefono1;
        },

        validateForm1() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ""));

            if (
                !this.form.socio_datos.correo ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.socio_datos.correo)
            )
                this.errors.correo = "Ingrese un correo válido.";
            if (!this.form.socio_datos.telefono)
                this.errors.telefono = "Este campo es obligatorio.";
            if (!this.form.socio_datos.nombres) this.errors.nombres = "Este campo es obligatorio.";
            if (!this.form.socio_datos.apellidos) this.errors.apellidos = "Describa su solicitud.";
            if (!this.form.socio_datos.doc_tipo)
                this.errors.doc_tipo = "Seleccione un tipo de documento.";
            if (!this.form.socio_datos.doc_numero)
                this.errors.doc_numero = "Este campo es obligatorio.";
            if (!this.form.socio_datos.privacidad)
                this.errors.privacidad = "Este campo es obligatorio.";

            return Object.values(this.errors).every((e) => !e);
        },
        async continuarEntrega() {
            if (!this.validateForm1()) return;

            if (this.user.id) {
                const send = {
                    id: this.user.id,
                    tipo: 2,
                    comes_from: "ecommerce",
                    user_token: localStorage.getItem("token"),
                    nombres: this.form.socio_datos.nombres,
                    apellidos: this.form.socio_datos.apellidos,
                    doc_tipo: this.form.socio_datos.doc_tipo,
                    doc_numero: this.form.socio_datos.doc_numero,
                    correo: this.form.socio_datos.correo,
                    telefono1: this.form.socio_datos.telefono,
                };

                // this.loadingContinuarEntrega = true;
                // await patch('account', send);
                // this.loadingContinuarEntrega = false;
            }

            this.step = 2;
            this.scrollToForm("seccionForm2");
        },

        validateForm2() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ""));

            if (this.form.entrega_tipo === "envio") {
                if (this.user.id) {
                    if (this.form.new_direccion) {
                        if (!this.form.direccion_nombre)
                            this.errors.direccion_nombre = "Este campo es obligatorio.";
                    } else {
                        if (!this.form.entrega_direccion_id)
                            this.errors.entrega_direccion_id = "Seleccione una dirección guardada.";
                    }
                }

                if (!this.form.entrega_ubigeo)
                    this.errors.entrega_ubigeo = "Este campo es obligatorio.";
                if (!this.form.direccion_entrega)
                    this.errors.direccion_entrega = "Este campo es obligatorio.";
                if (!this.form.entrega_direccion_datos.referencia)
                    this.errors.entrega_direccion_datos_referencia = "Este campo es obligatorio.";
            }

            if (this.form.entrega_tipo === "retiro") {
                if (!this.form.fecha_entrega)
                    this.errors.fecha_entrega = "Este campo es obligatorio.";
            }

            return Object.values(this.errors).every((e) => !e);
        },
        async continuarPago() {
            if (!this.validateForm2()) return;

            if (this.user.id) {
                if (this.form.new_direccion) {
                    const direcciones = JSON.parse(JSON.stringify(this.user.direcciones));
                    const newDireccionId = genId();
                    direcciones.push({
                        id: newDireccionId,
                        nombre: this.form.direccion_nombre,
                        ubigeo: this.form.entrega_ubigeo,
                        ubigeo1: this.form.entrega_direccion_datos.entrega_ubigeo1,
                        direccion: this.form.direccion_entrega,
                        numero: this.form.entrega_direccion_datos.numero,
                        piso: this.form.entrega_direccion_datos.piso,
                        referencia: this.form.entrega_direccion_datos.referencia,
                    });
                    const send = {
                        id: this.user.id,
                        tipo: 2,
                        comes_from: "ecommerce",
                        user_token: localStorage.getItem("token"),
                        direcciones,
                    };
                    this.loadingContinuarPago = true;
                    const res = await patch("account", send);
                    this.loadingContinuarPago = false;
                    if (res.code == 0) {
                        this.user.direcciones = res.data.direcciones;
                        this.form.new_direccion = false;
                        this.form.entrega_direccion_id = newDireccionId;
                    }
                }
                if (!this.user.wallet) {
                    await this.getCustomerWallet();
                }
            }

            this.step = 3;
            this.scrollToForm("seccionForm3");
        },

        validarForm3() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ""));

            if (this.form.comprobante_tipo === "01") {
                if (!this.form.comprobante_ruc || !/^\d{11}$/.test(this.form.comprobante_ruc))
                    this.errors.comprobante_ruc = "El RUC debe tener 11 dígitos numéricos.";
                if (!this.form.comprobante_razon_social)
                    this.errors.comprobante_razon_social = "Este campo es obligatorio.";
            }

            if (this.form.pago_metodo == "tarjeta") {
                if (!this.form.paymentMethodToken)
                    this.errors.paymentMethodToken = "Seleccione una tarjeta.";
            } else if (this.form.pago_metodo == "yape") {
                if (!this.form.pago_id) this.errors.pago_id = "Este campo es obligatorio.";
            }

            return Object.values(this.errors).every((e) => !e);
        },
        shapeDatos() {
            this.form.tipo = 2;
            this.form.origin = "ecommerce";
            this.form.fecha = new Date().toISOString().split("T")[0];
            this.form.socio = this.user.id;

            this.form.pago_condicion = "1";
            this.form.moneda = "1";
            this.form.monto = this.total.toFixed(2);

            this.form.socio_pedido_items = this.items;

            if (this.form.pago_metodo == "yape") {
                this.form.codigo = genId();
            }
        },
        async pagar() {
            if (!this.validarForm3()) return;

            if (this.form.pago_metodo == "tarjeta") {
                this.pagarConTarjeta();
            } else if (this.form.pago_metodo == "yape") {
                this.pagarConYape();
            }
        },
        async pagarConTarjeta() {
            const send = {
                monto: this.total.toFixed(2),
                correo: this.form.socio_datos.correo,
                user_id: this.user.id,
                paymentMethodToken: this.form.paymentMethodToken,
            };

            this.loadingPagar = true;
            const res = await post(`${urls.izipay}/create-payment`, send);
            this.loadingPagar = false;

            if (res.code == 1) {
                this.errors.general = res.msg;
            } else if (res.code == 0) {
                this.form.codigo = res.orderId;
                this.loadingPagar = true;
                const endpoint = "https://api.micuentaweb.pe";
                const publicKey = import.meta.env.PUBLIC_IZIPAY_PUBLIC_KEY;

                const { KR } = await KRGlue.loadLibrary(endpoint, publicKey);

                await KR.setFormConfig({
                    formToken: res.data.formToken,
                    "kr-language": "es-PE",
                });

                await KR.onFormCreated(() => {
                    this.loadingPagar = false;
                });

                await KR.onSubmit(async (paymentData) => {
                    this.shapeDatos();

                    const res1 = await post(`${urls.izipay}/validate-payment`, {
                        paymentData,
                        socio_pedido: this.form,
                    });

                    if (res1.code > 0) {
                        KR.closePopin();
                        this.errors.general = res1.msg;
                    } else if (res1.code == 0) {
                        this.paymentSuccess = true;
                        this.form.id = res.data.id;
                        Cart.clear();
                        KR.closePopin();

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
                    }

                    return false;
                });

                await KR.renderElements("#myPaymentForm");

                await KR.openPopin();
            }
        },
        async pagarConYape() {
            this.shapeDatos();

            this.loadingPagar = true;
            const res = await post("socio_pedidos", this.form);
            this.loadingPagar = false;

            if (res.code < 0) {
                this.errors.general = "Algo salió mal";
            }
            if (res.code > 0) {
                this.errors.general = res.msg;
            } else if (res.code == 0) {
                this.paymentSuccess = true;
                this.form.id = res.data.id;
                Cart.clear();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        },

        prevStep() {
            if (this.step > 1) this.step--;
            this.errors = {};

            if (this.step === 1) {
                this.scrollToForm("seccionForm1");
            }
            if (this.step === 2) {
                this.scrollToForm("seccionForm2");
            }
            if (this.step === 3) {
                this.scrollToForm("seccionForm3");
            }
        },
        scrollToForm(id) {
            setTimeout(() => {
                const el = this.$refs[id];
                if (el) {
                    const offset = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: offset, behavior: "smooth" });
                }
            }, 100);
        },

        async loadUbigeos(txtBuscar) {
            if (!txtBuscar) {
                this.ubigeos.length = 0;
                return;
            }

            const qry = {
                fltr: {
                    distrito: { op: "Contiene", val: txtBuscar },
                },
                cols: ["departamento", "provincia", "distrito", "nombre"],
            };

            this.ubigeosLoading = true;
            const res = await get("ubigeos", { qry }, localStorage.getItem("token"));
            this.ubigeosLoading = false;

            if (res.code !== 0) return;

            this.ubigeos = res.data;
        },
        setUbigeo(item) {
            this.form.entrega_direccion_datos.entrega_ubigeo1 = item;
        },

        setDireccion(item) {
            if (!item) {
                this.cleanDireccion();
                return;
            }

            this.ubigeos = [{ ...item.ubigeo1 }];

            this.form.entrega_ubigeo = item.ubigeo1.id;
            this.form.direccion_entrega = item.direccion;
            this.form.entrega_direccion_datos.numero = item.numero;
            this.form.entrega_direccion_datos.piso = item.piso;
            this.form.entrega_direccion_datos.referencia = item.referencia;
            this.form.entrega_direccion_datos.entrega_ubigeo1 = item.ubigeo1;
        },
        cleanDireccion() {
            this.ubigeos = [];

            this.form.direccion_nombre = null;
            this.form.entrega_direccion_id = null;

            this.form.entrega_ubigeo = "";
            this.form.direccion_entrega = "";
            this.form.entrega_direccion_datos.numero = "";
            this.form.entrega_direccion_datos.piso = "";
            this.form.entrega_direccion_datos.referencia = "";
            this.form.entrega_direccion_datos.entrega_ubigeo1 = null;
        },

        async getCustomerWallet() {
            this.loading = true;
            const res = await get(
                `${urls.account}/customer-wallet/${this.user.id}`,
                null,
                localStorage.getItem("token")
            );
            this.loading = false;

            if (res.code == 0) {
                this.user.wallet = res.data.tokens;
            }
        },

        getCardBrandIcon(brand) {
            if (!brand) return genericUrl;
            const b = brand.toUpperCase().trim();
            const map = {
                VISA: visaUrl,
                MASTERCARD: mastercardUrl,
                "DINERS CLUB": dinersUrl,
                DINERS: dinersUrl,
                "AMERICAN EXPRESS": amexUrl,
                AMEX: amexUrl,
            };
            return map[b] || genericUrl;
        },
    },
};
</script>
