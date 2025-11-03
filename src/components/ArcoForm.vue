<template>
    <div class="space-y-8" v-if="!enviado">
        <!-- Datos del titular -->
        <div>
            <h2 class="text-lg font-medium mb-4 text-neutral-900">
                Datos del titular de los datos personales
            </h2>

            <div class="grid md:grid-cols-2 gap-4">
                <JdInput
                    label="Nombres"
                    :nec="true"
                    v-model="form.nombres"
                    :error="errors.nombres"
                />

                <JdInput
                    label="Apellidos"
                    :nec="true"
                    v-model="form.apellidos"
                    :error="errors.apellidos"
                />

                <JdSelect
                    label="Tipo de documento"
                    :nec="true"
                    :lista="documentos_identidad"
                    v-model="form.doc_tipo"
                    :error="errors.doc_tipo"
                />

                <JdInput
                    label="Nro de documento"
                    :nec="true"
                    v-model="form.doc_numero"
                    :error="errors.doc_numero"
                />

                <!-- Adjuntar documento -->
                <div>
                    <label class="label">Adjuntar documento*</label>
                    <input
                        type="file"
                        @change="handleFile($event, 'doc_file')"
                        accept=".jpg,.jpeg,.png,.pdf"
                        class="input text-sm"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                        Máx. 5MB en formato jpg, jpeg, png o pdf
                    </p>
                    <p
                        v-if="errors.doc_file"
                        class="text-left text-red-500 text-xs mt-1 ml-2"
                    >
                        {{ errors.doc_file }}
                    </p>
                </div>

                <JdInput
                    label="Correo"
                    :nec="true"
                    v-model="form.email"
                    :error="errors.email"
                />

                <JdInput
                    label="Dirección"
                    :nec="true"
                    v-model="form.domicilio"
                    :error="errors.domicilio"
                />
            </div>
        </div>

        <!-- Representante -->
        <div>
            <h2 class="text-lg font-medium mb-4 text-neutral-900">
                Datos del representante del titular (si aplica)
            </h2>

            <p class="text-sm text-gray-600 mb-4">
                Este formulario deberá ser completado únicamente si el
                solicitante actúa como representante legal del titular.
            </p>

            <div class="grid md:grid-cols-2 gap-4">
                <JdInput
                    label="Nombres"
                    :nec="true"
                    v-model="form.rep_nombres"
                    :error="errors.rep_nombres"
                />

                <JdInput
                    label="Nombres"
                    :nec="true"
                    v-model="form.rep_apellidos"
                    :error="errors.rep_apellidos"
                />

                <JdInput
                    label="Nombres"
                    :nec="true"
                    v-model="form.rep_apellidos"
                    :error="errors.rep_apellidos"
                />

                <JdSelect
                    label="Tipo de documento"
                    :nec="true"
                    :lista="documentos_identidad"
                    v-model="form.rep_dot_tipo"
                    :error="errors.rep_dot_tipo"
                />

                <JdInput
                    label="Nro de documento"
                    :nec="true"
                    v-model="form.rep_doc_numero"
                    :error="errors.rep_doc_numero"
                />

                <div>
                    <label class="label"
                        >Documento que acredita la representación</label
                    >
                    <input
                        type="file"
                        @change="handleFile($event, 'rep_doc_file')"
                        accept=".jpg,.jpeg,.png,.pdf"
                        class="input text-sm"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                        Máx. 5MB en formato jpg, jpeg, png o pdf
                    </p>
                </div>
            </div>
        </div>

        <!-- Tipo de solicitud -->
        <div>
            <h2 class="text-lg font-medium mb-4 text-neutral-900">
                Tipo de solicitud
            </h2>

            <JdRadio
                label="Tipo"
                :nec="true"
                :lista="solicitud_tipos"
                v-model="form.tipo"
                :error="errors.tipo"
                :with-border="true"
            />
        </div>

        <!-- Detalle -->
        <div>
            <label class="label">Detalle de su solicitud*</label>
            <textarea
                v-model.trim="form.detalle"
                rows="4"
                class="input"
            ></textarea>
            <p
                v-if="errors.detalle"
                class="text-left text-red-500 text-xs mt-1 ml-2"
            >
                {{ errors.detalle }}
            </p>
        </div>

        <!-- Adjuntos -->
        <div>
            <label class="label">Adjuntar documentos adicionales</label>
            <input
                type="file"
                @change="handleFile($event, 'extras_doc')"
                accept=".jpg,.jpeg,.png,.pdf"
                class="input text-sm"
            />
            <p class="text-xs text-gray-500 mt-1">
                Máx. 5MB en formato jpg, jpeg, png o pdf
            </p>
        </div>

        <!-- Captcha -->
        <div class="flex flex-col gap-2 mt-6">
            <label class="label">Verificación humana*</label>
            <div class="flex">
                <div
                    class="g-recaptcha"
                    :data-sitekey="siteKey"
                    ref="recaptchaContainer"
                ></div>
            </div>
            <p
                v-if="errors.captcha"
                class="text-left text-red-500 text-xs mt-1 ml-2"
            >
                {{ errors.captcha }}
            </p>
        </div>

        <!-- Enviar -->
        <div class="flex justify-center pt-4">
            <button type="submit" :disabled="loading" class="button w-60">
                <!-- :class="[
                    'rounded-lg font-medium transition cursor-pointer flex items-center justify-center border',
                    'px-6 py-3 max-h-[3rem] w-40',
                    loading
                        ? 'bg-neutral-400 border-neutral-400 text-white cursor-not-allowed'
                        : 'border-neutral-900 bg-neutral-900 text-white hover:bg-white hover:text-neutral-900',
                ]" -->
                <span v-if="loading">Enviando…</span>
                <span v-else>Enviar</span>
            </button>
        </div>
    </div>

    <div
        v-else
        class="text-gray-700 text-center py-20 border border-gray-200 rounded-2xl bg-gray-50"
    >
        <h2 class="text-xl font-semibold text-gray-800 mb-2">
            ¡Tu solicitud fue enviada correctamente!
        </h2>
        <p class="text-gray-700">
            Te contactaremos pronto al correo proporcionado.
        </p>
    </div>
</template>

<script>
import { post } from '../lib/api.js';
import JdInput from '../components/JdInput.vue';
import JdSelect from './JdSelect.vue';
import JdRadio from '../components/JdRadio.vue';

export default {
    name: 'ArcoForm',
    components: {
        JdInput,
        JdSelect,
        JdRadio,
    },
    props: {
        documentos_identidad: { type: Array, default: () => [] },
    },
    data() {
        return {
            siteKey: import.meta.env.RECAPTCHA_SITE_KEY,
            recaptchaContainer: null,
            widgetId: null,

            loading: false,
            enviado: false,
            resMsg: '',

            form: {},
            errors: {},

            solicitud_tipos: [
                {
                    id: 'acceso',
                    nombre: 'Acceso',
                    descripcion:
                        'Obtener información personal almacenada y condiciones de tratamiento.',
                },
                {
                    id: 'rectificacion',
                    nombre: 'Rectificación',
                    descripcion: 'Corregir o actualizar información inexacta.',
                },
                {
                    id: 'cancelacion',
                    nombre: 'Cancelación',
                    descripcion: 'Suprimir información personal no necesaria.',
                },
                {
                    id: 'oposicion',
                    nombre: 'Oposición',
                    descripcion:
                        'Impedir o cesar el tratamiento de datos personales.',
                },
                {
                    id: 'informacion',
                    nombre: 'Información',
                    descripcion:
                        'Conocer la finalidad, destinatarios y tratamiento de los datos.',
                },
                {
                    id: 'revocacion',
                    nombre: 'Revocación',
                    descripcion:
                        'Retirar el consentimiento para el tratamiento de datos.',
                },
                {
                    id: 'portabilidad',
                    nombre: 'Portabilidad',
                    descripcion:
                        'Trasladar los datos personales a otro responsable.',
                },
            ],
        };
    },
    mounted() {
        // guardar referencia del contenedor
        this.recaptchaContainer = this.$refs.recaptchaContainer;
        this.tryRender();
    },
    methods: {
        handleFile(event, field) {
            const file = event.target.files[0];

            if (file && file.size > 5 * 1024 * 1024) {
                this.errors[field] = 'El archivo no debe superar los 5MB.';
                this.form[field] = null;
            } else {
                this.errors[field] = '';
                this.form[field] = file;
            }
        },

        validateForm() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

            if (!this.form.nombres) this.errors.nombres = 'Campo obligatorio.';
            if (!this.form.apellidos)
                this.errors.apellidos = 'Campo obligatorio.';
            if (!this.form.doc_tipo)
                this.errors.doc_tipo = 'Seleccione un tipo de documento.';
            if (!this.form.doc_numero)
                this.errors.doc_numero = 'Campo obligatorio.';
            if (!this.form.doc_file)
                this.errors.doc_file = 'Debe adjuntar su documento.';
            if (
                !this.form.email ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)
            )
                this.errors.email = 'Ingrese un email válido.';
            if (!this.form.domicilio)
                this.errors.domicilio = 'Campo obligatorio.';
            if (!this.form.tipo)
                this.errors.tipo = 'Seleccione un tipo de solicitud.';
            if (!this.form.detalle)
                this.errors.detalle = 'Describa su solicitud.';
            if (!this.form.captcha)
                this.errors.captcha = 'Resuelve el captcha.';

            return Object.values(this.errors).every((e) => !e);
        },

        shapeDatos() {
            this.form.is_form_data = true;
            this.form.fecha_recepcion = new Date();
        },

        async submitForm() {
            if (this.loading) return;

            // Intentamos obtener token directamente desde grecaptcha
            if (
                window.grecaptcha &&
                typeof window.grecaptcha.getResponse === 'function'
            ) {
                try {
                    const token =
                        this.widgetId !== null
                            ? window.grecaptcha.getResponse(this.widgetId)
                            : window.grecaptcha.getResponse();
                    if (token) {
                        this.form.captcha = token;
                        this.errors.captcha = '';
                    }
                } catch (err) {
                    console.warn('No se pudo leer token grecaptcha:', err);
                }
            }

            if (!this.validateForm()) return;

            this.loading = true;
            this.resMsg = '';

            this.shapeDatos();

            try {
                const res = await post('arco', this.form);
                this.resMsg = res.msg;
                this.loading = false;

                if (res.code == 0) {
                    this.enviado = true;

                    // ✅ Reset del widget visual
                    try {
                        if (
                            window.grecaptcha &&
                            typeof window.grecaptcha.reset === 'function'
                        ) {
                            if (this.widgetId !== null)
                                window.grecaptcha.reset(this.widgetId);
                            else window.grecaptcha.reset();
                        }
                    } catch (err) {
                        console.warn('Error al resetear grecaptcha:', err);
                    }

                    // ✅ Limpiar token del formulario
                    this.form.captcha = '';

                    // ✅ Limpiar todo el formulario
                    Object.keys(this.form).forEach((k) => {
                        if (
                            ['doc_file', 'rep_doc_file', 'extras_doc'].includes(
                                k
                            )
                        )
                            this.form[k] = null;
                        else this.form[k] = '';
                    });

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });
                }
            } catch (error) {
                this.resMsg =
                    'Ocurrió un error al enviar la solicitud. Inténtalo nuevamente.';
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        renderRecaptcha() {
            if (!this.recaptchaContainer) return;

            if (this.recaptchaContainer.hasChildNodes()) {
                console.log('⚠️ reCAPTCHA ya estaba renderizado.');

                if (
                    window.grecaptcha &&
                    typeof window.grecaptcha.getResponse === 'function'
                ) {
                    const token = window.grecaptcha.getResponse();
                    if (token) {
                        this.form.captcha = token;
                        this.errors.captcha = '';
                    }
                }
                return;
            }

            try {
                this.widgetId = window.grecaptcha.render(
                    this.recaptchaContainer,
                    {
                        sitekey: this.siteKey,
                        callback: (token) => {
                            this.form.captcha = token;
                            this.errors.captcha = '';
                        },
                        'expired-callback': () => {
                            this.form.captcha = '';
                            this.errors.captcha =
                                'El captcha ha expirado, por favor verifíquelo nuevamente.';
                        },
                    }
                );
                console.log(
                    '✅ reCAPTCHA renderizado correctamente. widgetId=',
                    this.widgetId
                );
            } catch (err) {
                console.error('❌ Error renderizando reCAPTCHA:', err);
            }
        },

        tryRender() {
            if (
                window.grecaptcha &&
                typeof window.grecaptcha.render === 'function'
            ) {
                window.grecaptcha.ready(() => this.renderRecaptcha());
            } else {
                console.log('⏳ Esperando a que se cargue grecaptcha...');
                setTimeout(this.tryRender, 300);
            }
        },
    },
};
</script>
