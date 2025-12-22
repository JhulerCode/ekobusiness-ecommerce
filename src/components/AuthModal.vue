<template>
    <div>
        <div>
            <a v-if="user.id" href="/account" class="flex items-center">
                <UserIcon />
                <div>
                    <span class="text-xs"> Hola, {{ userName }} </span>
                </div>
            </a>

            <UserIcon v-else @click="openModal('login')" class="cursor-pointer" />
        </div>

        <transition name="fade">
            <div v-if="isOpen" class="modal">
                <div class="center">
                    <header>
                        <h3>
                            {{ isLogin ? "Iniciar sesión" : "Crear cuenta" }}
                        </h3>

                        <button @click="closeModal">
                            <Xmark />
                        </button>
                    </header>

                    <main>
                        <div class="w-80">
                            <div class="space-y-4">
                                <JdInput
                                    label="Correo electrónico"
                                    :nec="true"
                                    v-model="form.correo"
                                    :error="errors.correo"
                                />

                                <JdInputPassword
                                    :label="isLogin ? 'Contraseña' : 'Nueva contraseña'"
                                    :nec="true"
                                    v-model="form.contrasena"
                                />

                                <JdInputPassword
                                    label="Confirmar contraseña"
                                    :nec="true"
                                    v-model="form.contrasena_confirmar"
                                    v-if="!isLogin"
                                    :error="errors.contrasena_confirmar"
                                />

                                <JdButton
                                    :text="isLogin ? 'Ingresar' : 'Registrarme'"
                                    @click="submitForm"
                                    :loading="isLoading"
                                    class="!w-full"
                                />

                                <p v-if="errors.general" class="input-error">
                                    {{ errors.general }}
                                </p>
                            </div>

                            <p class="text-center text-sm mt-6 text-gray-600">
                                {{ isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?" }}
                                <button
                                    @click="toggleMode"
                                    class="underline font-medium hover:text-black cursor-pointer"
                                >
                                    {{ isLogin ? "Regístrate aquí" : "Inicia sesión" }}
                                </button>
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import UserIcon from "../assets/icons/user.vue";

import JdInput from "../components/JdInput.vue";
import JdInputPassword from "../components/JdInputPassword.vue";
import JdButton from "../components/JdButton.vue";

import EyeOpen from "../assets/icons/eye-open.vue";
import EyeCancel from "../assets/icons/eye-cancel.vue";
import Xmark from "../assets/icons/xmark.vue";
import { urls, post, get } from "../lib/api.js";

export default {
    name: "AuthModal",
    components: {
        UserIcon,
        JdInput,
        JdInputPassword,
        JdButton,
        EyeOpen,
        EyeCancel,
        Xmark,
    },
    data() {
        return {
            isOpen: false,
            isLogin: true,
            form: {
                correo: "",
                contrasena: "",
                contrasena_confirmar: "",
            },
            errors: {},
            showPassword: false,
            showConfirm: false,
            isLoading: false,
            user: {},
        };
    },
    methods: {
        openModal(mode) {
            this.isLogin = mode === "login";
            this.isOpen = true;
            document.body.style.overflow = "hidden"; // evita scroll en fondo
        },
        closeModal() {
            this.isOpen = false;
            document.body.style.overflow = ""; // restaura scroll
            this.form = {};
        },
        toggleMode() {
            this.isLogin = !this.isLogin;
            this.errors = {};
        },
        validateForm() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ""));

            if (!this.form.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.correo))
                this.errors.correo = "Ingrese un correo válido.";

            if (!this.form.contrasena) this.errors.contrasena = "Este campo es obligatorio.";

            if (!this.isLogin) {
                if (!this.form.contrasena_confirmar)
                    this.errors.contrasena_confirmar = "Este campo es obligatorio.";

                if (!this.isLogin && this.form.contrasena !== this.form.contrasena_confirmar) {
                    this.errors.contrasena_confirmar = "Las contraseñas no coinciden.";
                    return;
                }
            }

            return Object.values(this.errors).every((e) => !e);
        },
        async submitForm() {
            if (this.isLoading) return;
            if (!this.validateForm()) return;

            this.isLoading = true;
            if (this.isLogin) {
                const res = await post(`${urls.auth}/signin`, this.form);
                this.isLoading = false;

                if (res.code < 0) {
                    this.errors.general = "Algo salió mal";
                } else if (res.code > 0) {
                    this.errors.general = res.msg;
                } else if (res.code == 0) {
                    this.user = { correo: this.form.correo };
                    localStorage.setItem("login-correo", this.form.correo);
                    localStorage.setItem("token", res.token);
                    this.closeModal();
                    window.location.reload();
                    // window.location.href = '/account';
                }
            } else {
                const res = await post(`${urls.auth}/register`, this.form);
                this.isLoading = false;

                if (res.code == 1) {
                    this.errors.correo = res.msg;
                } else if (res.code == 0) {
                    this.user = { correo: this.form.correo };
                    localStorage.setItem("token", res.token);
                    this.closeModal();
                    window.location.href = "/account";
                }
            }
        },
        async validateSession() {
            const user_token = localStorage.getItem("token");

            if (user_token) {
                const res = await get(`${urls.account}/login`, null, user_token);

                if (res.code == 0) {
                    this.user = res.data;
                }
            }
        },
    },
    mounted() {
        const correoStored = localStorage.getItem("login-correo");
        if (correoStored) this.form.correo = correoStored;
        this.validateSession();
    },
    computed: {
        userName() {
            return this.user.correo ? this.user.correo.split("@")[0] : "";
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
