<template>
    <form class="space-y-8" @submit.prevent="submitForm" v-if="!enviado">
        <!-- Datos del titular -->
        <div>
            <h2 class="text-lg font-medium mb-4 text-neutral-900">
                Datos del titular de los datos personales
            </h2>

            <div class="grid md:grid-cols-2 gap-4">
                <!-- Nombres -->
                <div>
                    <label class="label">Nombres*</label>
                    <input
                        v-model.trim="form.nombres"
                        type="text"
                        class="input"
                    />
                    <p
                        v-if="errors.nombres"
                        class="text-left text-red-500 text-xs mt-1 ml-2"
                    >
                        {{ errors.nombres }}
                    </p>
                </div>

                <!-- Apellidos -->
                <div>
                    <label class="label">Apellidos*</label>
                    <input
                        v-model.trim="form.apellidos"
                        type="text"
                        class="input"
                    />
                    <p
                        v-if="errors.apellidos"
                        class="text-left text-red-500 text-xs mt-1 ml-2"
                    >
                        {{ errors.apellidos }}
                    </p>
                </div>

                <!-- Tipo de documento -->
                <div>
                    <label class="label">Tipo de documento*</label>
                    <select v-model="form.doc_tipo" class="input">
                        <option>DNI</option>
                        <option>Carnet de Extranjería</option>
                        <option>Pasaporte</option>
                    </select>
                    <p
                        v-if="errors.doc_tipo"
                        class="text-left text-red-500 text-xs mt-1 ml-2"
                    >
                        {{ errors.doc_tipo }}
                    </p>
                </div>

                <!-- N° documento -->
                <div>
                    <label class="label">N° de documento*</label>
                    <input
                        v-model.trim="form.doc_numero"
                        type="text"
                        class="input"
                    />
                    <p
                        v-if="errors.doc_numero"
                        class="text-left text-red-500 text-xs mt-1 ml-2"
                    >
                        {{ errors.doc_numero }}
                    </p>
                </div>

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

                <!-- Email -->
                <div>
                    <label class="label">Email*</label>
                    <input
                        v-model.trim="form.email"
                        type="email"
                        class="input"
                    />
                    <p
                        v-if="errors.email"
                        class="text-left text-red-500 text-xs mt-1 ml-2"
                    >
                        {{ errors.email }}
                    </p>
                </div>

                <!-- Domicilio -->
                <div class="md:col-span-2">
                    <label class="label">Domicilio*</label>
                    <input
                        v-model.trim="form.domicilio"
                        type="text"
                        class="input"
                    />
                    <p
                        v-if="errors.domicilio"
                        class="text-left text-red-500 text-xs mt-1 ml-2"
                    >
                        {{ errors.domicilio }}
                    </p>
                </div>
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
                <div>
                    <label class="label">Nombres</label>
                    <input
                        v-model.trim="form.repNombres"
                        type="text"
                        class="input"
                    />
                </div>
                <div>
                    <label class="label">Apellidos</label>
                    <input
                        v-model.trim="form.repApellidos"
                        type="text"
                        class="input"
                    />
                </div>
                <div>
                    <label class="label">Tipo de documento</label>
                    <select v-model="form.repTipoDocumento" class="input">
                        <option>DNI</option>
                        <option>Carnet de Extranjería</option>
                        <option>Pasaporte</option>
                    </select>
                </div>
                <div>
                    <label class="label">N° de documento</label>
                    <input
                        v-model.trim="form.repNumeroDocumento"
                        type="text"
                        class="input"
                    />
                </div>
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

            <div class="flex flex-col gap-2 mt-3">
                <label
                    v-for="(desc, tipo) in tiposSolicitud"
                    :key="tipo"
                    class="text-sm leading-snug cursor-pointer select-none flex items-start gap-2"
                    :class="[
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
                    ]"
                >
                    <input
                        v-model="form.tipo"
                        type="radio"
                        :value="tipo"
                        class="appearance-none w-4 h-4 rounded-full border relative flex-shrink-0 cursor-pointer transition-all before:content-[''] before:absolute before:inset-[4px] before:rounded-full before:scale-0 before:transition-transform checked:before:scale-100"
                        :class="[
                            theme === 'dark'
                                ? [
                                      'bg-transparent border-gray-600 before:bg-gray-200',
                                      'checked:border-gray-200',
                                  ]
                                : [
                                      'bg-white border-neutral-300 before:bg-neutral-800',
                                      'checked:border-neutral-800',
                                  ],
                        ]"
                    />
                    <span class="text-left"
                        ><span>
                            <strong>{{ desc.titulo }}:</strong>
                            {{ desc.descripcion }}
                        </span></span
                    >
                </label>
            </div>

            <p
                v-if="errors.tipo"
                class="text-left text-red-500 text-xs mt-1 ml-2"
            >
                {{ errors.tipo }}
            </p>
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
            <button
                type="submit"
                :disabled="loading"
                :class="[
                    'rounded-lg font-medium transition cursor-pointer flex items-center justify-center border',
                    'px-6 py-3 max-h-[3rem] w-40',
                    loading
                        ? 'bg-neutral-400 border-neutral-400 text-white cursor-not-allowed'
                        : 'border-neutral-900 bg-neutral-900 text-white hover:bg-white hover:text-neutral-900',
                ]"
            >
                <span v-if="loading">Enviando…</span>
                <span v-else>Enviar</span>
            </button>
        </div>
    </form>

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

export default {
    name: 'ArcoForm',

    data() {
        return {
            theme: 'light',
            siteKey: import.meta.env.RECAPTCHA_SITE_KEY,
            recaptchaContainer: null,
            loading: false,
            resMsg: '',
            enviado: false,
            widgetId: null,
            form: {
                nombres: '',
                apellidos: '',
                doc_tipo: '',
                doc_numero: '',
                doc_file: null,
                email: '',
                domicilio: '',
                rep_nombres: '',
                rep_apellidos: '',
                rep_doc_tipo: '',
                rep_doc_numero: '',
                rep_doc_file: null,
                tipo: '',
                detalle: '',
                extras_doc: null,
                captcha: '',
            },
            errors: {},
            tiposSolicitud: {
                acceso: {
                    titulo: 'Acceso',
                    descripcion:
                        'Obtener información personal almacenada y condiciones de tratamiento.',
                },
                rectificacion: {
                    titulo: 'Rectificación',
                    descripcion: 'Corregir o actualizar información inexacta.',
                },
                cancelacion: {
                    titulo: 'Cancelación',
                    descripcion: 'Suprimir información personal no necesaria.',
                },
                oposicion: {
                    titulo: 'Oposición',
                    descripcion:
                        'Impedir o cesar el tratamiento de datos personales.',
                },
                informacion: {
                    titulo: 'Información',
                    descripcion:
                        'Conocer la finalidad, destinatarios y tratamiento de los datos.',
                },
                revocacion: {
                    titulo: 'Revocación',
                    descripcion:
                        'Retirar el consentimiento para el tratamiento de datos.',
                },
                portabilidad: {
                    titulo: 'Portabilidad',
                    descripcion:
                        'Trasladar los datos personales a otro responsable.',
                },
            },
        };
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

    mounted() {
        // guardar referencia del contenedor
        this.recaptchaContainer = this.$refs.recaptchaContainer;
        this.tryRender();
    },
};
</script>
