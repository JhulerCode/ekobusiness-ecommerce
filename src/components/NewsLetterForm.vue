<template>
    <form
        @submit.prevent="submit"
        :class="[
            'flex justify-center',
            layout === 'vertical'
                ? 'flex-col gap-3'
                : 'flex-col sm:flex-row gap-4',
        ]"
    >
        <div class="flex-1 flex flex-col">
            <input
                v-model="email"
                type="email"
                placeholder="Tu correo electrónico"
                :class="[
                    'rounded-lg border focus:outline-none focus:ring-2 transition w-full',
                    layout === 'vertical' ? 'px-4 py-2 text-sm' : 'px-4 py-3',
                    theme === 'dark'
                        ? [
                              'bg-transparent text-gray-200 placeholder-gray-400',
                              'border-gray-600 focus:ring-white',
                          ]
                        : [
                              'bg-white text-black placeholder-gray-500',
                              'border-neutral-300 focus:ring-neutral-800',
                          ],
                ]"
            />

            <p
                v-if="emailError"
                class="text-left text-red-500 text-xs mt-1 ml-2"
            >
                {{ emailError }}
            </p>

            <!-- Checkbox de privacidad -->
            <label
                class="text-sm leading-snug cursor-pointer select-none mt-3 flex items-start gap-2"
                :class="[theme === 'dark' ? 'text-gray-400' : 'text-gray-600']"
            >
                <input
                    v-model="acceptedPrivacy"
                    type="checkbox"
                    class="appearance-none w-4 h-4 rounded-md border relative flex-shrink-0 cursor-pointer before:content-['✓'] before:absolute before:text-[10px] before:inset-0 before:flex before:items-center before:justify-center before:text-white checked:before:opacity-100 before:opacity-0 transition-all"
                    :class="[
                        theme === 'dark'
                            ? [
                                  'bg-transparent text-gray-200 placeholder-gray-400',
                                  'border-gray-600 focus:ring-white',
                                  'text-gray-200',
                              ]
                            : [
                                  'bg-white text-black placeholder-gray-500',
                                  'border-neutral-300 focus:ring-neutral-800',
                                  'dark:before:text-black',
                              ],
                    ]"
                />
                <span class="text-left">
                    He leído la
                    <a
                        href="/politica-de-privacidad"
                        target="_blank"
                        class="underline"
                        :class="[
                            theme === 'dark'
                                ? 'hover:text-white'
                                : 'hover:text-gray-900',
                        ]"
                    >
                        Política de Privacidad de SUNKA
                    </a>
                    y declaro haber sido informado sobre el tratamiento de mis
                    datos personales.
                </span>
            </label>

            <p
                v-if="privacyError"
                class="text-left text-red-500 text-xs mt-1 ml-2"
            >
                {{ privacyError }}
            </p>

            <!-- Mensajes -->
            <template v-if="showMsg">
                <p v-if="success" class="text-sm mt-1 text-green-600">
                    ¡Suscrito correctamente!
                </p>
                <p
                    v-if="resMsg && !success"
                    class="text-sm mt-1 text-amber-500"
                >
                    {{ resMsg }}
                </p>
            </template>
        </div>

        <!-- Botón -->
        <button
            type="submit"
            :disabled="loading"
            :class="[
                'rounded-lg font-medium transition cursor-pointer flex items-center justify-center border',
                layout === 'vertical'
                    ? 'w-full px-4 py-2 text-sm'
                    : 'px-6 py-3 max-h-[3rem]',
                theme === 'dark'
                    ? loading
                        ? 'bg-gray-500 border-gray-500 text-gray-200 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-gray-200 border-white'
                    : loading
                    ? 'bg-neutral-400 border-neutral-400 text-white cursor-not-allowed'
                    : 'border-neutral-900 bg-neutral-900 text-white hover:bg-white hover:text-neutral-900',
            ]"
        >
            <span v-if="loading">Enviando…</span>
            <span v-else>Suscribirme</span>
        </button>
    </form>
</template>

<script>
import { post } from '../lib/api.js';

export default {
    name: 'NewsletterForm',
    props: {
        theme: {
            type: String,
            default: 'light',
        },
        layout: {
            type: String,
            default: 'horizontal',
        },
    },
    data() {
        return {
            email: '',
            acceptedPrivacy: false,
            emailError: '',
            privacyError: '',

            loading: false,
            success: false,
            resMsg: null,
            showMsg: false,
            timeOutShowMsg: null,
        };
    },
    methods: {
        validEmail(e) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
        },

        async submit() {
            // Reiniciar errores
            this.emailError = '';
            this.privacyError = '';
            this.success = false;

            // Validar correo
            if (!this.email.trim() || !this.validEmail(this.email)) {
                this.emailError = 'Por favor, ingrese un correo válido.';
            }

            // Validar privacidad
            if (!this.acceptedPrivacy) {
                this.privacyError = 'Este campo es obligatorio.';
            }

            // Si hay errores, detener envío
            if (this.emailError || this.privacyError) return;

            // Enviar datos
            this.loading = true;
            try {
                const res = await post(
                    'newsletter',
                    { correo: this.email },
                    'Correo'
                );
                this.showMsg = true;
                this.resMsg = res.msg;

                if (res.code != 0) return;

                this.success = true;
                this.email = '';
                this.acceptedPrivacy = false;
            } catch (err) {
                this.showMsg = true;
                this.resMsg = 'Ocurrió un error. Intenta nuevamente.';
            } finally {
                this.loading = false;

                clearTimeout(this.timeOutShowMsg);

                this.timeOutShowMsg = setTimeout(() => {
                    this.resMsg = null;
                    this.showMsg = false;
                }, 4000);
            }
        },
    },
};
</script>
