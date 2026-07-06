<template>
    <form
        @submit.prevent="submit"
        :class="[
            'flex justify-center',
            variant === 'home'
                ? 'flex-row gap-0'
                : layout === 'vertical'
                  ? 'flex-col gap-3'
                  : 'flex-col sm:flex-row gap-4',
        ]"
    >
        <div class="flex flex-1 flex-col">
            <input
                v-model="email"
                type="email"
                placeholder="Tu correo electronico"
                :class="[
                    'w-full border transition focus:outline-none focus:ring-2',
                    variant === 'home'
                        ? 'h-12 rounded-none border-r-0 px-4 text-sm'
                        : 'rounded-lg',
                    layout === 'vertical' && variant !== 'home'
                        ? 'px-4 py-2 text-sm'
                        : variant !== 'home'
                          ? 'px-4 py-3'
                          : '',
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

            <p v-if="emailError" class="ml-2 mt-1 text-left text-xs text-red-500">
                {{ emailError }}
            </p>

            <label
                v-if="showPrivacy"
                class="mt-3 flex cursor-pointer select-none items-start gap-2 text-sm leading-snug"
                :class="[theme === 'dark' ? 'text-gray-400' : 'text-gray-600']"
            >
                <input
                    v-model="acceptedPrivacy"
                    type="checkbox"
                    class="relative h-4 w-4 flex-shrink-0 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:inset-0 before:flex before:items-center before:justify-center before:text-[10px] before:text-white before:opacity-0 before:content-['✓'] checked:before:opacity-100"
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
                    He leido la
                    <a
                        href="/politica-de-privacidad"
                        target="_blank"
                        class="underline"
                        :class="[theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900']"
                    >
                        Politica de Privacidad de SUNKA
                    </a>
                    y declaro haber sido informado sobre el tratamiento de mis datos personales.
                </span>
            </label>

            <p v-if="privacyError" class="ml-2 mt-1 text-left text-xs text-red-500">
                {{ privacyError }}
            </p>

            <template v-if="showMsg">
                <p v-if="success" class="mt-1 text-sm text-green-600">
                    Suscrito correctamente.
                </p>
                <p v-if="resMsg && !success" class="mt-1 text-sm text-amber-500">
                    {{ resMsg }}
                </p>
            </template>
        </div>

        <button
            type="submit"
            :disabled="loading"
            :class="[
                'flex cursor-pointer items-center justify-center border font-medium transition',
                variant === 'home'
                    ? 'h-12 rounded-none border-sunka-brass bg-sunka-brass px-7 text-[12px] font-semibold uppercase tracking-[0.08em] text-sunka-white hover:bg-sunka-brass-light hover:text-sunka-ink'
                    : 'rounded-lg',
                layout === 'vertical' && variant !== 'home'
                    ? 'w-full px-4 py-2 text-sm'
                    : variant !== 'home'
                      ? 'max-h-[3rem] px-6 py-3'
                      : '',
                variant !== 'home' && theme === 'dark'
                    ? loading
                        ? 'cursor-not-allowed border-gray-500 bg-gray-500 text-gray-200'
                        : 'border-white bg-white text-black hover:bg-gray-200'
                    : variant !== 'home'
                      ? loading
                          ? 'cursor-not-allowed border-neutral-400 bg-neutral-400 text-white'
                          : 'border-neutral-900 bg-neutral-900 text-white hover:bg-white hover:text-neutral-900'
                      : loading
                        ? 'cursor-not-allowed opacity-70'
                        : '',
            ]"
        >
            <span v-if="loading">Enviando...</span>
            <span v-else>Suscribirme</span>
        </button>
    </form>
</template>

<script>
import { post } from '../lib/api.js'

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
        variant: {
            type: String,
            default: 'default',
        },
        showPrivacy: {
            type: Boolean,
            default: true,
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
        }
    },
    methods: {
        validEmail(e) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
        },

        async submit() {
            this.emailError = ''
            this.privacyError = ''
            this.success = false

            if (!this.email.trim() || !this.validEmail(this.email)) {
                this.emailError = 'Por favor, ingrese un correo valido.'
            }

            if (this.showPrivacy && !this.acceptedPrivacy) {
                this.privacyError = 'Este campo es obligatorio.'
            }

            if (this.emailError || this.privacyError) return

            this.loading = true
            try {
                const res = await post('newsletter', { correo: this.email }, 'Correo')
                this.showMsg = true
                this.resMsg = res.msg

                if (res.code != 0) return

                this.success = true
                this.email = ''
                this.acceptedPrivacy = false
            } catch (err) {
                this.showMsg = true
                this.resMsg = 'Ocurrio un error. Intenta nuevamente.'
            } finally {
                this.loading = false

                clearTimeout(this.timeOutShowMsg)

                this.timeOutShowMsg = setTimeout(() => {
                    this.resMsg = null
                    this.showMsg = false
                }, 4000)
            }
        },
    },
}
</script>
