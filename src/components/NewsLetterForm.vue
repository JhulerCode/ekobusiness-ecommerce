<!-- <template>
    <form
        @submit.prevent="submit"
        :class="[
            'flex gap-3 justify-center',
            layout === 'vertical' ? 'flex-col' : 'flex-col sm:flex-row',
        ]"
    >
        <div class="flex-1 flex flex-col">
            <input
                v-model="email"
                type="email"
                placeholder="Tu correo electrónico"
                :class="[
                    'px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition w-full',
                    theme === 'dark'
                        ? [
                              'bg-transparent text-gray-200 placeholder-gray-400',
                              error
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-gray-600 focus:ring-white',
                          ]
                        : [
                              'bg-white text-black placeholder-gray-500',
                              error
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-neutral-300 focus:ring-neutral-800',
                          ],
                ]"
            />
            <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
            <p v-if="success" class="text-sm mt-1">
                <span>¡Suscrito correctamente!</span>
            </p>
            <p v-if="resMsg" class="text-sm mt-1">
                <span>{{ resMsg }}</span>
            </p>
        </div>

        <button
            type="submit"
            :disabled="loading"
            :class="[
                'px-6 py-3 rounded-lg border font-medium shadow-sm transition cursor-pointer flex items-center justify-center',
                layout === 'vertical' ? 'w-full' : 'max-h-[3rem]',
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
            default: 'light', // 'light' o 'dark'
        },
        layout: {
            type: String,
            default: 'horizontal', // 'horizontal' o 'vertical'
        },
    },
    data() {
        return {
            email: '',
            loading: false,
            error: '',
            success: false,
            resMsg: null,
        };
    },
    watch: {
        email(value) {
            if (!value) {
                this.error = '';
                return;
            }
            this.error = this.validEmail(value)
                ? ''
                : 'Por favor ingresa un correo válido.';
        },
    },
    methods: {
        validEmail(e) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
        },
        async submit() {
            if (this.loading) return;
            if (!this.validEmail(this.email)) {
                this.error = 'Por favor ingresa un correo válido.';
                return;
            }

            this.loading = true;
            this.error = '';
            this.success = false;

            try {
                const res = await post(
                    'newsletter',
                    { correo: this.email },
                    'Correo'
                );
                this.resMsg = res.msg;

                if (res.code != 0) return;

                this.success = true;
                this.email = '';
            } catch (err) {
                this.error = 'Ocurrió un error. Intenta nuevamente.';
            } finally {
                this.loading = false;
            }
        },
    },
};
</script> -->

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
                              error
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-gray-600 focus:ring-white',
                          ]
                        : [
                              'bg-white text-black placeholder-gray-500',
                              error
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-neutral-300 focus:ring-neutral-800',
                          ],
                ]"
            />

            <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
            <p v-if="success" class="text-sm mt-1 text-green-600">
                ¡Suscrito correctamente!
            </p>
            <p v-if="resMsg" class="text-sm mt-1">{{ resMsg }}</p>
        </div>

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
            default: 'light', // "light" o "dark"
        },
        layout: {
            type: String,
            default: 'horizontal', // "horizontal" o "vertical"
        },
    },
    data() {
        return {
            email: '',
            loading: false,
            error: '',
            success: false,
            resMsg: null,
        };
    },
    watch: {
        email(value) {
            if (!value) {
                this.error = '';
                return;
            }
            this.error = this.validEmail(value)
                ? ''
                : 'Por favor ingresa un correo válido.';
        },
    },
    methods: {
        validEmail(e) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
        },
        async submit() {
            if (this.loading) return;
            if (!this.validEmail(this.email)) {
                this.error = 'Por favor ingresa un correo válido.';
                return;
            }

            this.loading = true;
            this.error = '';
            this.success = false;

            try {
                const res = await post(
                    'newsletter',
                    { correo: this.email },
                    'Correo'
                );
                this.resMsg = res.msg;

                if (res.code != 0) return;

                this.success = true;
                this.email = '';
            } catch (err) {
                this.error = 'Ocurrió un error. Intenta nuevamente.';
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
