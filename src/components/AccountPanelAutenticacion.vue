<template>
    <div>
        <div class="flex justify-between mb-4">
            <h2 class="text-xl font-semibold">
                {{ headText }}
            </h2>

            <div class="flex gap-2"></div>
        </div>

        <div>
            <div
                class="flex justify-between items-end mt-8 mb-3 border-b border-gray-300 pb-1"
            >
                <h3 class="text-md font-semibold text-gray-700">Contraseña</h3>

                <p class="text-gray-500 text-xs">
                    Actualizada el: {{ contrasena_updated_at }}
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
                <div v-if="pestana == 0">
                    <p class="text-gray-800">No puede cambiar su contraseña</p>
                    <p class="text-gray-400 text-sm">
                        Tiene que pasar un periodo de 30 días desde la última
                        modificación.
                    </p>
                </div>

                <div v-if="pestana == 1">
                    <JdInput
                        label="Ingrese el cógido de verificación enviado a su correo"
                        :nec="true"
                        v-model="form.codigo_verificacion"
                        :error="errors.codigo_verificacion"
                        maxlength="6"
                    />

                    <div class="flex gap-2 justify-end mt-2">
                        <JdButton
                            :text="
                                codigo_enviado
                                    ? 'Pedir codigo otra vez'
                                    : 'Pedir codigo'
                            "
                            :loading="loading"
                            tipo="2"
                            @click="sendCodigoVerificacion"
                            v-if="showEnviarCodigo"
                        />

                        <JdButton
                            text="Verificar codigo"
                            :loading="loading"
                            @click="validateCodigoVerificacion"
                        />
                    </div>
                </div>

                <template v-if="pestana == 2">
                    <p class="text-gray-400 text-sm">Rellene ambos campos</p>

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

                    <div class="flex justify-end col-start-2">
                        <JdButton
                            text="Actualizar"
                            :loading="loading"
                            @click="actualizarContrasena"
                        />

                        <p v-if="errors.general" class="input-error">
                            {{ errors.general }}
                        </p>
                    </div>
                </template>

                <div>
                    <p
                        v-if="errors.success"
                        class="text-sm mt-1 text-green-600"
                    >
                        ¡Contraseña actualizada con éxito!
                    </p>

                    <p v-if="errors.general" class="input-error">
                        {{ errors.general }}
                    </p>

                    <p v-if="errors.codigo_pedido" class="text-sm mt-1">
                        {{ errors.codigo_pedido }}
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-30">
            <h3
                class="text-md font-semibold text-gray-700 mt-8 mb-3 border-b border-gray-300 pb-1"
            >
                Eliminar cuenta
            </h3>

            <p class="text-gray-600 mb-6 leading-relaxed">
                Al eliminar tu cuenta de
                <span class="font-semibold">{{ companySite }}</span
                >, perderás el acceso permanente a tu información e historial.
                Ya no podrás:
            </p>

            <ul class="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li>Realizar compras online.</li>
                <li>Revisar tu historial de pedidos.</li>
                <li>Gestionar tus datos personales.</li>
                <li>Solicitar devoluciones o seguimiento de pedidos.</li>
            </ul>

            <div class="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6">
                <p class="text-sm text-gray-500">
                    Esta acción es
                    <span class="text-red-600 font-medium">irreversible</span>.
                    Si eliminas tu cuenta, todos tus datos personales asociados
                    serán eliminados definitivamente.
                </p>
            </div>

            <div class="flex justify-end space-x-4">
                <JdButton
                    text="Eliminar cuenta definitivamente"
                    @click="openQuestion"
                    class="bg-red-600 hover:bg-red-700 border-none"
                />
            </div>
        </div>
    </div>

    <transition name="fade">
        <div v-if="showQuestion" class="modal">
            <div class="center">
                <main>
                    <p>¡Esta acción no se puede deshacer!</p>
                    <p>
                        Tu cuenta y todos tus datos serán eliminados
                        permanentemente.
                    </p>

                    <p v-if="errors.eliminar" class="input-error">
                        {{ errors.eliminar }}
                    </p>
                </main>

                <footer>
                    <JdButton text="Cancelar" tipo="2" @click="closeQuestion" />
                    <JdButton
                        text="Sí, eliminar cuenta"
                        :loading="loadingDelete"
                        @click="eliminar"
                    />
                </footer>
            </div>
        </div>
    </transition>
</template>

<script>
import JdInput from '../components/JdInput.vue';
import JdInputPassword from '../components/JdInputPassword.vue';
import JdLoading from '../components/LoadingSpin.vue';
import JdButton from '../components/JdButton.vue';
import { urls, post, delet } from '../lib/api.js';
import { companySite } from '../lib/empresa.js';

export default {
    components: {
        JdInput,
        JdInputPassword,
        JdLoading,
        JdButton,
    },
    props: {
        headText: { type: String, default: '' },
        user: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            pestana: 1,
            loading: false,
            form: {},
            errors: {},
            timeOutShowMsgs: null,

            codigo_enviado: false,
            showEnviarCodigo: true,
            timeOutShowEnviarCodigo: null,

            showQuestion: false,
            loadingDelete: false,

            companySite,
        };
    },
    computed: {
        contrasena_updated_at() {
            return new Date(this.user.contrasena_updated_at).toLocaleDateString(
                'es-ES',
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }
            );
        },
    },
    created() {
        // this.validateLastUpdated();
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
                user_token: localStorage.getItem('token'),
                correo: this.user.correo,
            };

            this.loading = true;
            const res = await post(`${urls.account}/send-codigo`, send);
            this.loading = false;

            if (res.code < 0) {
                this.errors.general = 'Algo salió mal';
            } else if (res.code > 0) {
                this.errors.general = res.msg;
            } else if (res.code == 0) {
                this.codigo_enviado = true;
                this.showEnviarCodigo = false;

                clearTimeout(this.timeOutShowEnviarCodigo);

                this.errors.codigo_pedido =
                    'Esperando 1 minuto para volver a pedir un código nuevo.';

                this.timeOutShowEnviarCodigo = setTimeout(() => {
                    this.showEnviarCodigo = true;
                    this.errors.codigo_pedido = null;
                }, 1000 * 60);
            }
        },

        validateForm1() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

            if (!this.form.codigo_verificacion)
                this.errors.codigo_verificacion = 'Este campo es obligatorio.';

            return Object.values(this.errors).every((e) => !e);
        },
        async validateCodigoVerificacion() {
            if (!this.validateForm1()) return;

            const send = {
                user_token: localStorage.getItem('token'),
                correo: this.user.correo,
                codigo_verificacion: this.form.codigo_verificacion,
            };

            this.loading = true;
            const res = await post(`${urls.account}/verify-codigo`, send);
            this.loading = false;

            if (res.code < 0) {
                this.errors.general = 'Algo salió mal';
            } else if (res.code > 0) {
                this.errors.general = res.msg;
            } else if (res.code == 0) {
                this.pestana = 2;
            }
        },

        validateForm2() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

            if (!this.form.contrasena)
                this.errors.contrasena = 'Este campo es obligatorio.';

            if (!this.form.contrasena_confirmar)
                this.errors.contrasena_confirmar = 'Este campo es obligatorio.';

            if (this.form.contrasena !== this.form.contrasena_confirmar) {
                this.errors.contrasena_confirmar =
                    'Las contraseñas no coinciden.';
                return;
            }

            return Object.values(this.errors).every((e) => !e);
        },
        shapeDatos() {
            return {
                id: this.user.id,
                contrasena: this.form.contrasena,
                user_token: localStorage.getItem('token'),
            };
        },
        async actualizarContrasena() {
            if (!this.validateForm2()) return;

            const send = this.shapeDatos();

            this.loading = true;
            const res = await post(`${urls.account}/update-password`, send);
            this.loading = false;

            if (res.code < 0) {
                this.errors.general = 'Algo salió mal';
            } else if (res.code == 0) {
                this.editing = false;
                this.form = {};
                this.errors = {};
                this.user.contrasena_updated_at =
                    res.data.contrasena_updated_at;

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
            document.body.style.overflow = 'hidden'; // evita scroll en fondo
            this.toDelete = i;
        },
        closeQuestion() {
            this.showQuestion = false;
            document.body.style.overflow = '';
        },
        async eliminar() {
            const send = {
                user_token: localStorage.getItem('token'),
                id: this.user.id,
            };

            this.loadingDelete = true;
            const res = await delet('account', send);
            this.loadingDelete = false;

            if (res.code < 0) {
                this.errors.eliminar = 'Algo salió mal';
            } else if (res.code > 0) {
                this.errors.eliminar = res.data;
            } else if (res.code == 0) {
                this.closeQuestion();

                localStorage.removeItem('token');
                window.location.href = '/';
                this.user = null;
            }
        },
    },
};
</script>
