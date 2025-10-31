<template>
    <div v-if="user" class="text-gray-800">
        <!-- Encabezado -->
        <div class="mb-8 text-2xl font-semibold text-center md:text-left">
            Hola, {{ userName }}
        </div>

        <!-- Layout principal -->
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
            <!-- 📂 Menú lateral -->
            <aside
                class="w-full lg:w-1/4 bg-white rounded-2xl shadow-md p-6 sm:p-8"
            >
                <nav class="space-y-2 sm:space-y-3">
                    <button
                        v-for="item in menu"
                        :key="item.key"
                        @click="active = item.key"
                        class="block w-full text-left py-2 px-2 rounded-md font-medium transition-colors duration-200 cursor-pointer"
                        :class="[
                            active === item.key
                                ? 'text-black font-semibold bg-gray-100'
                                : 'text-gray-500 hover:text-black hover:bg-gray-50',
                        ]"
                    >
                        {{ item.label }}
                    </button>
                </nav>

                <div class="mt-8 border-t border-gray-200 pt-4">
                    <button
                        @click="logout"
                        class="text-red-500 hover:text-red-600 font-medium cursor-pointer"
                    >
                        Salir
                    </button>
                </div>
            </aside>

            <!-- 🧾 Contenido dinámico -->
            <main
                class="w-full lg:flex-1 bg-white rounded-2xl shadow-md p-6 sm:p-8 min-h-[400px]"
            >
                <AccountPanelPerfil
                    v-if="active === 'perfil'"
                    :user="user"
                    :headText="menuText"
                />

                <AccountPanelDirecciones
                    v-else-if="active === 'direcciones'"
                    :user="user"
                    :headText="menuText"
                />

                <AccountPanelPagoMetodos
                    v-else-if="active === 'pago_metodos'"
                    :user="user"
                    :headText="menuText"
                />

                <AccountPanelPedidos
                    v-else-if="active === 'pedidos'"
                    :user="user"
                    :headText="menuText"
                />

                <AccountPanelAutenticacion
                    v-else-if="active === 'autenticacion'"
                    :user="user"
                    :headText="menuText"
                />
            </main>
        </div>
    </div>

    <div v-else class="text-center text-gray-600 py-20">
        <p>No has iniciado sesión.</p>
    </div>
</template>

<script>
import { urls, get } from '../lib/api.js';
import AccountPanelPerfil from './AccountPanelPerfil.vue';
import AccountPanelDirecciones from './AccountPanelDirecciones.vue';
import AccountPanelPagoMetodos from './AccountPanelPagoMetodos.vue';
import AccountPanelPedidos from './AccountPanelPedidos.vue';
import AccountPanelAutenticacion from './AccountPanelAutenticacion.vue';

export default {
    components: {
        AccountPanelPerfil,
        AccountPanelDirecciones,
        AccountPanelPagoMetodos,
        AccountPanelPedidos,
        AccountPanelAutenticacion,
    },
    data() {
        return {
            user: null,
            active: 'autenticacion',
            menu: [
                { key: 'perfil', label: 'Perfil' },
                { key: 'direcciones', label: 'Direcciones' },
                { key: 'pago_metodos', label: 'Medios de pago' },
                { key: 'pedidos', label: 'Pedidos' },
                { key: 'autenticacion', label: 'Autenticación' },
            ],
            errors: {},
        };
    },
    methods: {
        async validateSession() {
            const user_token = localStorage.getItem('token');
            if (user_token) {
                const res = await get(
                    `${urls.account}/verify`,
                    null,
                    user_token
                );
                if (res.code == 0) this.user = res.data;
            }
        },
        logout() {
            localStorage.removeItem('token');
            window.location.href = '/';
            this.user = null;
        },

        //--- Direcciones ---//
        confirmarEliminar(index) {
            const dir = this.user.direcciones[index];
            if (confirm(`¿Eliminar la dirección "${dir.nombre}"?`)) {
                this.user.direcciones.splice(index, 1);
            }
        },
        direccionEditar(index) {
            const dir = this.user.direcciones[index];
            const nuevoNombre = prompt(
                'Editar nombre de dirección:',
                dir.nombre
            );
            if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
                this.user.direcciones[index].nombre = nuevoNombre.trim();
            }
        },
        direccionMarcarPrincipal(index) {
            this.user.direcciones.forEach((d) => (d.principal = false));
            this.user.direcciones[index].principal = true;
        },
    },
    mounted() {
        this.validateSession();
    },
    computed: {
        userName() {
            if (!this.user) return '';

            return this.user.nombres
                ? this.user.nombres
                : this.user.correo.split('@')[0];
        },
        menuText() {
            return this.menu.find((m) => m.key === this.active)?.label;
        },
        // updateUser(item) {
        //     Object.assign(this.user, item);
        // },
    },
};
</script>
