<template>
    <div>
        <!-- Botón que abre el modal -->
        <UserIcon @click="openModal('login')" class="cursor-pointer" />

        <!-- Modal -->
        <transition name="fade">
            <div
                v-if="isOpen"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            >
                <div
                    class="relative bg-white rounded-2xl shadow-xl text-gray-800 w-90 max-w-md mx-4 px-8 py-8"
                >
                    <button
                        class="absolute top-4 right-6 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                        @click="closeModal"
                    >
                        <Xmark />
                    </button>

                    <!-- Contenedor del formulario -->
                    <div class="w-full max-w-sm">
                        <h2 class="text-2xl font-semibold text-center mb-6">
                            {{ isLogin ? 'Iniciar sesión' : 'Crear cuenta' }}
                        </h2>

                        <div class="space-y-4">
                            <div>
                                <label class="label">Correo electrónico</label>
                                <input
                                    v-model="form.email"
                                    type="email"
                                    required
                                    class="input"
                                />
                                <p v-if="errors.email" class="input-error">
                                    {{ errors.email }}
                                </p>
                            </div>

                            <div class="relative">
                                <label class="label">Contraseña</label>
                                <input
                                    v-model="form.password"
                                    :type="showPassword ? 'text' : 'password'"
                                    required
                                    class="input pr-10"
                                />
                                <button
                                    type="button"
                                    @click="showPassword = !showPassword"
                                    class="absolute right-3 top-8 text-gray-500 cursor-pointer"
                                >
                                    <EyeOpen v-if="showPassword" />
                                    <EyeCancel v-else />
                                </button>
                                <p v-if="errors.password" class="input-error">
                                    {{ errors.password }}
                                </p>
                            </div>

                            <div v-if="!isLogin" class="relative">
                                <label class="label"
                                    >Confirmar contraseña</label
                                >
                                <input
                                    v-model="form.confirm"
                                    :type="showConfirm ? 'text' : 'password'"
                                    required
                                    class="input pr-10"
                                />
                                <button
                                    type="button"
                                    @click="showConfirm = !showConfirm"
                                    class="absolute right-3 top-8 text-gray-500 cursor-pointer"
                                >
                                    <EyeOpen v-if="showConfirm" />
                                    <EyeCancel v-else />
                                </button>
                                <p v-if="errors.confirm" class="input-error">
                                    {{ errors.confirm }}
                                </p>
                            </div>

                            <button @click="submitForm" class="w-full button">
                                {{ isLogin ? 'Ingresar' : 'Registrarme' }}
                            </button>
                        </div>

                        <p class="text-center text-sm mt-6 text-gray-600">
                            {{
                                isLogin
                                    ? '¿No tienes una cuenta?'
                                    : '¿Ya tienes una cuenta?'
                            }}
                            <button
                                @click="toggleMode"
                                class="underline font-medium hover:text-black cursor-pointer"
                            >
                                {{
                                    isLogin
                                        ? 'Regístrate aquí'
                                        : 'Inicia sesión'
                                }}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import UserIcon from '../assets/icons/user.vue';
import EyeOpen from '../assets/icons/eye-open.vue';
import EyeCancel from '../assets/icons/eye-cancel.vue';
import Xmark from '../assets/icons/xmark.vue';

export default {
    name: 'AuthModal',
    components: {
        UserIcon,
        EyeOpen,
        EyeCancel,
        Xmark,
    },
    data() {
        return {
            isOpen: false,
            isLogin: true,
            form: {
                email: '',
                password: '',
                confirm: '',
            },
            errors: {},
            showPassword: false,
            showConfirm: false,
        };
    },
    methods: {
        openModal(mode) {
            this.isLogin = mode === 'login';
            this.isOpen = true;
            document.body.style.overflow = 'hidden'; // evita scroll en fondo
        },
        closeModal() {
            this.isOpen = false;
            document.body.style.overflow = ''; // restaura scroll
        },
        toggleMode() {
            this.isLogin = !this.isLogin;
            this.errors = {};
        },
        validateForm() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

            if (
                !this.form.email ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)
            )
                this.errors.email = 'Ingrese un email válido.';

            if (!this.form.password)
                this.errors.password = 'Este campo es obligatorio.';

            if (!this.isLogin) {
                if (!this.form.confirm)
                    this.errors.confirm = 'Este campo es obligatorio.';

                if (!this.isLogin && this.form.password !== this.form.confirm) {
                    this.errors.confirm = 'Las contraseñas no coinciden.';
                    return;
                }
            }

            return Object.values(this.errors).every((e) => !e);
        },
        submitForm() {
            if (!this.validateForm()) return;

            // Aquí iría la llamada a tu backend o API
            console.log('Formulario enviado:', this.form);
            this.closeModal();
        },
    },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
