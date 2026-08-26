<template>
    <div>
        <div>
            <a
                v-if="user.id"
                href="/account"
                class="flex items-center gap-2 text-current transition-colors duration-300 hover:text-sunka-brass-light"
            >
                <UserIcon />
                <span class="hidden text-[11px] font-semibold uppercase tracking-[0.1em] xl:inline">
                    Hola, {{ userName }}
                </span>
            </a>

            <button
                v-else
                type="button"
                @click="openModal('login')"
                class="flex cursor-pointer items-center justify-center text-current transition-colors duration-300 hover:text-sunka-brass-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sunka-brass-light"
                aria-label="Iniciar sesión"
            >
                <UserIcon />
            </button>
        </div>

        <Teleport to="body">
            <transition name="auth-modal">
                <div
                    v-if="isOpen"
                    class="fixed inset-0 z-[200] flex items-center justify-center bg-sunka-ink/70 p-4 backdrop-blur-sm sm:p-6"
                    @click.self="closeModal"
                >
                <section
                    class="flex max-h-[calc(100dvh-2rem)] w-full max-w-[480px] flex-col overflow-hidden border border-sunka-sand bg-sunka-white text-sunka-ink shadow-[0_28px_80px_rgba(9,8,6,0.32)] sm:max-h-[calc(100dvh-3rem)]"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="isLogin ? 'auth-login-title' : 'auth-register-title'"
                >
                    <header class="relative border-b border-sunka-sand bg-sunka-cream px-6 py-7 sm:px-9 sm:py-8">
                        <div class="pr-10">
                            <p
                                class="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-sunka-brass"
                            >
                                {{ isLogin ? 'Bienvenido de nuevo' : 'Sé parte de SUNKA' }}
                            </p>
                            <h2
                                :id="isLogin ? 'auth-login-title' : 'auth-register-title'"
                                class="font-heading text-3xl font-semibold leading-tight text-sunka-forest sm:text-[2rem]"
                            >
                                {{ isLogin ? 'Iniciar sesión' : 'Crear una cuenta' }}
                            </h2>
                            <p class="mt-2 max-w-sm text-sm leading-relaxed text-sunka-stone">
                                {{
                                    isLogin
                                        ? 'Ingresa para continuar con tu experiencia SUNKA.'
                                        : 'Regístrate para gestionar tus pedidos y datos personales.'
                                }}
                            </p>
                        </div>

                        <button
                            type="button"
                            @click="closeModal"
                            class="absolute top-6 right-6 flex h-9 w-9 cursor-pointer items-center justify-center border border-sunka-sand text-sunka-stone transition-colors hover:border-sunka-brass hover:bg-sunka-white hover:text-sunka-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sunka-brass sm:top-8 sm:right-8"
                            aria-label="Cerrar"
                        >
                            <Xmark />
                        </button>
                    </header>

                    <main class="overflow-y-auto px-6 py-7 sm:px-9 sm:py-8">
                        <form @submit.prevent="submitForm">
                            <div class="space-y-5">
                                <JdInput
                                    label="Correo electrónico"
                                    :nec="true"
                                    v-model="form.correo"
                                    :error="errors.correo"
                                    placeholder="nombre@correo.com"
                                />

                                <JdInputPassword
                                    :label="isLogin ? 'Contraseña' : 'Nueva contraseña'"
                                    :nec="true"
                                    v-model="form.contrasena"
                                    :error="errors.contrasena"
                                    placeholder="Ingresa tu contraseña"
                                />

                                <JdInputPassword
                                    label="Confirmar contraseña"
                                    :nec="true"
                                    v-model="form.contrasena_confirmar"
                                    v-if="!isLogin"
                                    :error="errors.contrasena_confirmar"
                                    placeholder="Repite tu contraseña"
                                />

                                <JdButton
                                    :text="isLogin ? 'Ingresar' : 'Registrarme'"
                                    @click="submitForm"
                                    :loading="isLoading"
                                    class="!mt-7 !h-12 !w-full !rounded-none !border-sunka-ink !bg-sunka-ink !px-5 !py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sunka-white transition-colors hover:!border-sunka-forest hover:!bg-sunka-forest"
                                />

                                <p
                                    v-if="errors.general"
                                    class="border-l-2 border-[var(--sunka-danger)] bg-[#f8eee9] px-3 py-2.5 text-xs leading-relaxed text-[var(--sunka-danger)]"
                                    role="alert"
                                >
                                    {{ errors.general }}
                                </p>
                            </div>

                            <p
                                class="mt-7 border-t border-sunka-sand pt-6 text-center text-sm text-sunka-stone"
                            >
                                {{ isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?' }}
                                <button
                                    type="button"
                                    @click="toggleMode"
                                    class="ml-1 cursor-pointer border-b border-sunka-brass pb-0.5 font-semibold text-sunka-forest transition-colors hover:text-sunka-brass focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sunka-brass"
                                >
                                    {{ isLogin ? 'Regístrate aquí' : 'Inicia sesión' }}
                                </button>
                            </p>
                        </form>
                    </main>
                </section>
                </div>
            </transition>
        </Teleport>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserIcon from '../assets/icons/user.vue'

import JdInput from '../components/JdInput.vue'
import JdInputPassword from '../components/JdInputPassword.vue'
import JdButton from '../components/JdButton.vue'

import EyeOpen from '../assets/icons/eye-open.vue'
import EyeCancel from '../assets/icons/eye-cancel.vue'
import Xmark from '../assets/icons/xmark.vue'
import { urls, post, get } from '../lib/api'

export default defineComponent({
    name: 'AuthModal',
    components: {
        UserIcon,
        JdInput,
        JdInputPassword,
        JdButton,
        EyeOpen,
        EyeCancel,
        Xmark,
    },
    props: {
        initialUser: { type: Object, default: null },
        initialSessionStatus: { type: String, default: 'unknown' },
    },
    data() {
        return {
            isOpen: false,
            isLogin: true,
            form: {
                correo: '',
                contrasena: '',
                contrasena_confirmar: '',
            },
            errors: {},
            showPassword: false,
            showConfirm: false,
            isLoading: false,
            user: this.initialUser || {},
            sessionStatus: this.initialSessionStatus,
        }
    },
    methods: {
        openModal(mode) {
            this.isLogin = mode === 'login'
            this.isOpen = true
            document.body.style.overflow = 'hidden' // evita scroll en fondo
        },
        closeModal() {
            this.isOpen = false
            document.body.style.overflow = '' // restaura scroll
            this.form = {}
        },
        toggleMode() {
            this.isLogin = !this.isLogin
            this.errors = {}
        },
        validateForm() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''))

            if (!this.form.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.correo))
                this.errors.correo = 'Ingrese un correo válido.'

            if (!this.form.contrasena) this.errors.contrasena = 'Este campo es obligatorio.'

            if (!this.isLogin) {
                if (!this.form.contrasena_confirmar)
                    this.errors.contrasena_confirmar = 'Este campo es obligatorio.'

                if (!this.isLogin && this.form.contrasena !== this.form.contrasena_confirmar) {
                    this.errors.contrasena_confirmar = 'Las contraseñas no coinciden.'
                    return
                }
            }

            return Object.values(this.errors).every((e) => !e)
        },
        async submitForm() {
            if (this.isLoading) return
            if (!this.validateForm()) return

            this.isLoading = true
            if (this.isLogin) {
                const res = await post(`${urls.auth}/signin`, this.form)
                this.isLoading = false

                if (!res.ok) {
                    this.errors.general = res.problem.detail
                } else {
                    this.user = { correo: this.form.correo }
                    localStorage.setItem('login-correo', this.form.correo)
                    this.closeModal()
                    window.location.reload()
                    // window.location.href = '/account';
                }
            } else {
                const res = await post(`${urls.auth}/register`, this.form)
                this.isLoading = false

                if (!res.ok) {
                    if (res.problem.type.endsWith(':already-exists')) {
                        this.errors.correo = res.problem.detail
                    } else {
                        this.errors.general = res.problem.detail
                    }
                } else {
                    this.user = { correo: this.form.correo }
                    this.closeModal()
                    window.location.href = '/account'
                }
            }
        },
        async validateSession() {
            const res = await get(`${urls.account}/session`)
            if (res.ok) {
                this.user = res.data
                this.sessionStatus = 'authenticated'
            } else if (res.status === 401) {
                this.user = {}
                this.sessionStatus = 'guest'
            }
        },
    },
    mounted() {
        const correoStored = localStorage.getItem('login-correo')
        if (correoStored) this.form.correo = correoStored
        if (!['authenticated', 'guest'].includes(this.sessionStatus)) this.validateSession()
    },
    computed: {
        userName() {
            return this.user.correo ? this.user.correo.split('@')[0] : ''
        },
    },
})
</script>

<style scoped>
.auth-modal-enter-active,
.auth-modal-leave-active {
    transition: opacity 220ms ease;
}

.auth-modal-enter-active section,
.auth-modal-leave-active section {
    transition:
        opacity 220ms ease,
        transform 220ms ease;
}

.auth-modal-enter-from,
.auth-modal-leave-to {
    opacity: 0;
}

.auth-modal-enter-from section,
.auth-modal-leave-to section {
    opacity: 0;
    transform: translateY(12px) scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
    .auth-modal-enter-active,
    .auth-modal-leave-active,
    .auth-modal-enter-active section,
    .auth-modal-leave-active section {
        transition: none;
    }
}
</style>
