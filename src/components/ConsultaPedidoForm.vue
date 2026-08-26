<template>
    <article
        class="overflow-hidden rounded-2xl border border-sunka-sand bg-sunka-white shadow-[0_18px_45px_rgba(35,29,24,0.07)]"
    >
        <header class="border-b border-sunka-sand px-6 py-6 md:px-9">
            <p class="text-[9px] font-semibold uppercase tracking-[0.18em] text-sunka-brass">
                Datos de consulta
            </p>
            <h2 class="mt-2 font-heading text-2xl font-semibold text-sunka-forest">
                Identifica tu pedido
            </h2>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-sunka-stone">
                {{
                    showResend
                        ? 'Ingresa el número de pedido y el correo utilizado al realizar la compra.'
                        : 'Ingresa el número del pedido y el código de seis dígitos que recibiste por correo.'
                }}
            </p>
        </header>

        <form
            class="grid gap-5 px-6 py-7 sm:grid-cols-2 md:px-9 md:py-8"
            @submit.prevent="showResend ? reenviarCodigo() : consultarPedido()"
        >
            <JdInput
                label="Número de pedido"
                :nec="true"
                v-model="codigo"
                placeholder="Ejemplo: 1762018452516211"
                :error="error"
                maxlength="30"
                :class="{ 'sm:col-span-2': showResend }"
            />

            <JdInput
                v-if="!showResend"
                label="Código de consulta"
                :nec="true"
                v-model="codigoConsulta"
                placeholder="Ejemplo: 482193"
                :error="codigoConsultaError"
                maxlength="6"
            />

            <button
                v-if="!showResend"
                type="submit"
                class="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-sunka-brass bg-sunka-brass px-5 text-[11px] font-bold text-sunka-white transition-colors hover:bg-[#c69a50] disabled:cursor-not-allowed disabled:opacity-65 sm:col-span-2"
                :disabled="loading"
            >
                <LoadingSpin
                    v-if="loading"
                    :rellenar="false"
                    :shadowBack="false"
                    scale="0.55"
                />
                <span>{{ loading ? 'Buscando pedido' : 'Consultar pedido' }}</span>
                <span v-if="!loading" aria-hidden="true">→</span>
            </button>

            <button
                type="button"
                class="mx-auto cursor-pointer border-b border-sunka-brass/50 pb-0.5 text-[10px] font-semibold text-sunka-brass transition-colors hover:border-sunka-forest hover:text-sunka-forest sm:col-span-2"
                @click="toggleResendMode"
            >
                {{ showResend ? 'Ya tengo mi código de consulta' : 'No tengo mi código de consulta' }}
            </button>

            <div
                v-if="showResend"
                class="border border-sunka-sand bg-sunka-cream p-4 sm:col-span-2 sm:p-5"
            >
                <p class="mb-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-sunka-brass">
                    Recuperar código
                </p>
                <JdInput
                    label="Correo de la compra"
                    type="email"
                    v-model="correo"
                    placeholder="tu@correo.com"
                    :error="correoError"
                    maxlength="254"
                />
                <button
                    type="button"
                    :disabled="resendLoading"
                    @click="reenviarCodigo"
                    class="mt-3 min-h-11 w-full cursor-pointer rounded-lg border border-sunka-forest bg-sunka-forest px-5 text-[10px] font-bold text-sunka-white transition-colors hover:bg-sunka-ink disabled:cursor-not-allowed disabled:opacity-65"
                >
                    {{ resendLoading ? 'Enviando' : 'Enviar un código nuevo' }}
                </button>
                <p v-if="resendMessage" class="mt-3 text-[11px] leading-relaxed text-sunka-stone">
                    {{ resendMessage }}
                </p>
            </div>
        </form>

        <footer
            class="border-t border-sunka-sand bg-sunka-cream/55 px-6 py-5 text-center md:px-9"
        >
            <p class="text-[9px] font-semibold uppercase tracking-[0.14em] text-sunka-stone">
                ¿Necesitas ayuda?
            </p>
            <a
                :href="`mailto:${empresa.email_ventas}`"
                class="mt-1.5 inline-block break-all text-sm font-semibold text-sunka-brass transition-colors hover:text-sunka-forest"
            >
                {{ empresa.email_ventas }}
            </a>
        </footer>
    </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import JdInput from './JdInput.vue'
import LoadingSpin from './LoadingSpin.vue'
import { post, urls } from '../lib/api'

export default defineComponent({
    components: {
        JdInput,
        LoadingSpin,
    },
    props: {
        empresa: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            codigo: '',
            codigoConsulta: '',
            correo: '',
            error: '',
            codigoConsultaError: '',
            correoError: '',
            loading: false,
            resendLoading: false,
            resendMessage: '',
            showResend: false,
        }
    },
    methods: {
        async consultarPedido() {
            this.error = ''
            this.codigoConsultaError = ''
            if (!this.codigo.trim()) {
                this.error = 'Por favor, ingresa un número de pedido.'
            }
            if (!/^\d{6}$/.test(this.codigoConsulta.trim())) {
                this.codigoConsultaError = 'Ingresa el código de seis dígitos.'
            }
            if (this.error || this.codigoConsultaError) return

            this.loading = true
            const res = await post(
                `${urls.socio_pedidos}/consulta`,
                {
                    codigo: this.codigo.trim(),
                    codigo_consulta: this.codigoConsulta.trim(),
                },
                false,
            )
            this.loading = false

            if (!res.ok) {
                this.error = res.problem.detail
            } else {
                window.location.href = res.data.redirect_url
            }
        },
        async reenviarCodigo() {
            this.error = ''
            this.correoError = ''
            this.resendMessage = ''

            if (!this.codigo.trim()) {
                this.error = 'Por favor, ingresa un número de pedido.'
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo.trim())) {
                this.correoError = 'Ingresa el correo utilizado en la compra.'
            }
            if (this.error || this.correoError) return

            this.resendLoading = true
            const res = await post(
                `${urls.socio_pedidos}/consulta/reenviar`,
                { codigo: this.codigo.trim(), correo: this.correo.trim() },
                false,
            )
            this.resendLoading = false

            this.resendMessage = res.ok
                ? res.data?.message
                : res.problem.detail || 'No se pudo procesar la solicitud. Inténtalo más tarde.'
        },
        toggleResendMode() {
            this.showResend = !this.showResend
            this.codigoConsultaError = ''
            this.correoError = ''
            this.resendMessage = ''
        },
    },
})
</script>
