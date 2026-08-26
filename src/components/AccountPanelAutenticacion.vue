<template>
    <div>
        <div class="mb-8 border-b border-sunka-sand pb-6">
            <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-sunka-brass">
                Seguridad de la cuenta
            </p>
            <h2 class="mt-2 font-heading text-2xl font-semibold text-sunka-forest">
                {{ headText }}
            </h2>
            <p class="mt-1 text-sm text-sunka-stone">Gestiona tu contraseña y protege el acceso a tu cuenta.</p>
        </div>

        <div class="border border-sunka-sand bg-sunka-white p-5 sm:p-6">
            <div class="mb-6 flex flex-col gap-1 border-b border-sunka-sand pb-4 sm:flex-row sm:items-end sm:justify-between">
                <h3 class="font-heading text-lg font-semibold text-sunka-forest">Contraseña</h3>

                <p class="text-xs text-sunka-stone">Última actualización: {{ contrasena_updated_at }}</p>
            </div>

            <div class="grid gap-5 md:grid-cols-2">
                <div v-if="pestana == 0" class="border-l-2 border-sunka-brass bg-sunka-cream px-4 py-3 md:col-span-2">
                    <p class="text-sm font-semibold text-sunka-forest">Tu contraseña se actualizó recientemente</p>
                    <p class="mt-1 text-sm leading-relaxed text-sunka-stone">
                        Deben pasar 30 días desde la última modificación para volver a cambiarla.
                    </p>
                </div>

                <div v-if="pestana == 1" class="md:col-span-2">
                    <JdInput
                        label="Ingresa el código de verificación enviado a tu correo"
                        :nec="true"
                        v-model="form.codigo_verificacion"
                        :error="errors.codigo_verificacion"
                        maxlength="6"
                    />

                    <div class="mt-4 flex flex-wrap justify-end gap-2">
                        <JdButton
                            :text="codigo_enviado ? 'Pedir codigo otra vez' : 'Pedir codigo'"
                            :loading="loading"
                            tipo="2"
                            @click="sendCodigoVerificacion"
                            v-if="showEnviarCodigo"
                            class="!rounded-none !border-sunka-sand text-[10px] font-semibold uppercase tracking-[0.12em]"
                        />

                        <JdButton
                            text="Verificar codigo"
                            :loading="loading"
                            @click="validateCodigoVerificacion"
                            class="!rounded-none !border-sunka-ink !bg-sunka-ink text-[10px] font-semibold uppercase tracking-[0.12em] text-sunka-white"
                        />
                    </div>
                </div>

                <template v-if="pestana == 2">
                    <p class="text-sm text-sunka-stone md:col-span-2">Completa ambos campos para actualizar tu contraseña.</p>

                    <JdInputPassword
                        label="Nueva contraseña"
                        :nec="true"
                        v-model="form.contrasena"
                        :error="errors.contrasena"
                        class="col-start-1"
                    />

                    <JdInputPassword
                        label="Confirmar contraseña"
                        :nec="true"
                        v-model="form.contrasena_confirmar"
                        :error="errors.contrasena_confirmar"
                    />

                    <div class="flex flex-col items-end gap-2 md:col-start-2">
                        <JdButton
                            text="Actualizar"
                            :loading="loading"
                            @click="actualizarContrasena"
                            class="!rounded-none !border-sunka-ink !bg-sunka-ink !px-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-sunka-white"
                        />

                        <p v-if="errors.general" class="input-error">
                            {{ errors.general }}
                        </p>
                    </div>
                </template>

                <div class="md:col-span-2">
                    <p v-if="errors.success" class="border-l-2 border-sunka-olive bg-sunka-olive/10 px-3 py-2 text-sm text-sunka-olive">
                        ¡Contraseña actualizada con éxito!
                    </p>

                    <p v-if="errors.general" class="input-error">
                        {{ errors.general }}
                    </p>

                    <p v-if="errors.codigo_pedido" class="mt-1 text-sm text-sunka-stone">
                        {{ errors.codigo_pedido }}
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-10 border border-[rgba(159,81,62,0.28)] bg-[#fffaf7] p-5 sm:p-6 md:mt-12">
            <div class="mb-5 border-b border-[rgba(159,81,62,0.2)] pb-4">
                <p class="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--sunka-danger)]">Zona de riesgo</p>
                <h3 class="mt-2 font-heading text-lg font-semibold text-sunka-forest">Eliminar cuenta</h3>
            </div>

            <p class="mb-5 text-sm leading-relaxed text-sunka-stone">
                Al eliminar tu cuenta, perderás el acceso permanente a tu información e historial.
                Ya no podrás:
            </p>

            <ul class="mb-6 list-inside list-disc space-y-1 text-sm leading-relaxed text-sunka-ink/75 marker:text-[var(--sunka-danger)]">
                <li>Realizar compras online.</li>
                <li>Revisar tu historial de pedidos.</li>
                <li>Gestionar tus datos personales.</li>
                <li>Solicitar devoluciones o seguimiento de pedidos.</li>
            </ul>

            <div class="mb-6 border-l-2 border-[var(--sunka-danger)] bg-[#f8eee9] p-4">
                <p class="text-sm leading-relaxed text-sunka-stone">
                    Esta acción es
                    <span class="font-semibold text-[var(--sunka-danger)]">irreversible</span>. Si eliminas tu
                    cuenta, todos tus datos personales asociados serán eliminados definitivamente.
                </p>
            </div>

            <div class="flex justify-end">
                <JdButton
                    text="Eliminar cuenta definitivamente"
                    @click="openQuestion"
                    class="!rounded-none !border-[var(--sunka-danger)] !bg-[var(--sunka-danger)] !px-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-sunka-white hover:opacity-90"
                />
            </div>
        </div>
    </div>

    <transition name="fade">
        <div v-if="showQuestion" class="fixed inset-0 z-[110] flex items-center justify-center bg-sunka-ink/70 p-4 backdrop-blur-sm" @click.self="closeQuestion">
            <div class="w-full max-w-md border border-sunka-sand bg-sunka-white shadow-2xl">
                <main class="px-7 py-8">
                    <p class="text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--sunka-danger)]">Acción irreversible</p>
                    <p class="mt-2 font-heading text-xl font-semibold text-sunka-forest">¿Deseas eliminar tu cuenta?</p>
                    <p class="mt-2 text-sm leading-relaxed text-sunka-stone">Tu cuenta y todos tus datos serán eliminados permanentemente.</p>

                    <p v-if="errors.eliminar" class="input-error">
                        {{ errors.eliminar }}
                    </p>
                </main>

                <footer class="flex justify-end gap-2 border-t border-sunka-sand bg-sunka-cream/50 px-7 py-4">
                    <JdButton text="Cancelar" tipo="2" @click="closeQuestion" class="!rounded-none !border-sunka-sand" />
                    <JdButton
                        text="Sí, eliminar cuenta"
                        :loading="loadingDelete"
                        @click="eliminar"
                        class="!rounded-none !border-[var(--sunka-danger)] !bg-[var(--sunka-danger)] text-sunka-white"
                    />
                </footer>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import JdInput from "../components/JdInput.vue";
import JdInputPassword from "../components/JdInputPassword.vue";
import JdLoading from "../components/LoadingSpin.vue";
import JdButton from "../components/JdButton.vue";
import { urls, post, delet } from "../lib/api";
import { CheckoutDraft } from "../lib/checkout-draft";

export default defineComponent({
    components: {
        JdInput,
        JdInputPassword,
        JdLoading,
        JdButton,
    },
    props: {
        headText: { type: String, default: "" },
        user: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            pestana: 0,
            loading: false,
            form: {},
            errors: {},
            timeOutShowMsgs: null,

            codigo_enviado: false,
            showEnviarCodigo: true,
            timeOutShowEnviarCodigo: null,

            showQuestion: false,
            loadingDelete: false,
        };
    },
    computed: {
        contrasena_updated_at() {
            return new Date(this.user.contrasena_updated_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
    },
    created() {
        this.validateLastUpdated();
    },
    methods: {
        validateLastUpdated() {
            const hoy = new Date();
            const fechaComparar = new Date(this.user.contrasena_updated_at);

            const diffMs = hoy - fechaComparar;

            // Convertimos a días
            const diffDias = diffMs / (1000 * 60 * 60 * 24);

            if (diffDias < 30) {
                this.pestana = 0;
            } else {
                this.pestana = 2;
            }
        },

        async sendCodigoVerificacion() {
            const send = {
                correo: this.user.correo,
            };

            this.loading = true;
            const res = await post(
                `${urls.account}/send-codigo`,
                send,
                undefined,
            );
            this.loading = false;

            if (!res.ok) {
                this.errors.general = res.problem.detail;
            } else {
                this.codigo_enviado = true;
                this.showEnviarCodigo = false;

                clearTimeout(this.timeOutShowEnviarCodigo);

                this.errors.codigo_pedido =
                    "Esperando 1 minuto para volver a pedir un código nuevo.";

                this.timeOutShowEnviarCodigo = setTimeout(() => {
                    this.showEnviarCodigo = true;
                    this.errors.codigo_pedido = null;
                }, 1000 * 60);
            }
        },

        validateForm1() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ""));

            if (!this.form.codigo_verificacion)
                this.errors.codigo_verificacion = "Este campo es obligatorio.";

            return Object.values(this.errors).every((e) => !e);
        },
        async validateCodigoVerificacion() {
            if (!this.validateForm1()) return;

            const send = {
                correo: this.user.correo,
                codigo_verificacion: this.form.codigo_verificacion,
            };

            this.loading = true;
            const res = await post(
                `${urls.account}/verify-codigo`,
                send,
                undefined,
            );
            this.loading = false;

            if (!res.ok) {
                this.errors.general = res.problem.detail;
            } else {
                this.pestana = 2;
            }
        },

        validateForm2() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ""));

            if (!this.form.contrasena) this.errors.contrasena = "Este campo es obligatorio.";

            if (!this.form.contrasena_confirmar)
                this.errors.contrasena_confirmar = "Este campo es obligatorio.";

            if (this.form.contrasena !== this.form.contrasena_confirmar) {
                this.errors.contrasena_confirmar = "Las contraseñas no coinciden.";
                return;
            }

            return Object.values(this.errors).every((e) => !e);
        },
        shapeDatos() {
            return {
                id: this.user.id,
                contrasena: this.form.contrasena,
            };
        },
        async actualizarContrasena() {
            if (!this.validateForm2()) return;

            const send = this.shapeDatos();

            this.loading = true;
            const res = await post(
                `${urls.account}/update-password`,
                send,
                undefined,
            );
            this.loading = false;

            if (!res.ok) {
                this.errors.general = res.problem.detail;
            } else {
                this.editing = false;
                this.form = {};
                this.errors = {};
                this.user.contrasena_updated_at = res.data.contrasena_updated_at;

                this.validateLastUpdated();
                this.errors.success = true;

                clearTimeout(this.timeOutShowMsgs);

                this.timeOutShowMsgs = setTimeout(() => {
                    this.errors.success = false;
                }, 1000 * 5);
            }
        },

        openQuestion(i) {
            this.showQuestion = true;
            document.body.style.overflow = "hidden"; // evita scroll en fondo
            this.toDelete = i;
        },
        closeQuestion() {
            this.showQuestion = false;
            document.body.style.overflow = "";
        },
        async eliminar() {
            const send = {
                id: this.user.id,
            };

            this.loadingDelete = true;
            const res = await delet("account", send);
            this.loadingDelete = false;

            if (!res.ok) {
                this.errors.eliminar = res.problem.detail;
            } else {
                this.closeQuestion();

                CheckoutDraft.clear();
                window.location.href = "/";
                this.user = null;
            }
        },
    },
})
</script>
