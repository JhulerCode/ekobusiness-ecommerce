<template>
    <div v-if="user">
        <div class="mb-6 text-2xl">Hola, {{ userName }}</div>

        <div class="text-gray-700 flex flex-col md:flex-row items-start gap-8">
            <!-- 📂 Menú lateral -->
            <aside class="md:w-1/4 p-8 rounded-2xl bg-white shadow-md">
                <nav class="space-y-3">
                    <button
                        v-for="item in menu"
                        :key="item.key"
                        @click="active = item.key"
                        class="block w-full text-left py-1 rounded-md font-medium transition-colors cursor-pointer"
                        :class="[
                            active === item.key
                                ? 'text-black font-semibold'
                                : 'text-gray-500 hover:text-black',
                        ]"
                    >
                        {{ item.label }}
                    </button>
                </nav>

                <div class="mt-8 border-t border-gray-200 pt-3">
                    <button
                        @click="logout"
                        class="text-red-500 hover:text-red-600 font-medium cursor-pointer"
                    >
                        Salir
                    </button>
                </div>
            </aside>

            <!-- 🧾 Contenido dinámico -->
            <main class="flex-1 p-8 rounded-2xl bg-white shadow-md">
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

                <div v-else-if="active === 'pagos'" :headText="menuText">
                    <p>No hay medios de pago guardados.</p>
                </div>

                <div
                    v-else-if="active === 'autenticacion'"
                    :headText="menuText"
                >
                    <p>Último acceso: {{ user.ultimo_acceso || '—' }}</p>
                </div>

                <div v-else-if="active === 'pedidos'" :headText="menuText">
                    <p>No hay pedidos disponibles.</p>
                </div>
            </main>
        </div>
    </div>

    <div v-else class="text-center text-gray-600">
        <p>No has iniciado sesión.</p>

        <button
            @click="$emit('open-login')"
            class="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
            Iniciar sesión
        </button>
    </div>
</template>

<script>
import { urls, get } from '../lib/api.js';
import AccountPanelPerfil from './AccountPanelPerfil.vue';
import AccountPanelDirecciones from './AccountPanelDirecciones.vue';

export default {
    components: {
        AccountPanelPerfil,
        AccountPanelDirecciones,
    },
    data() {
        return {
            user: null,
            active: 'direcciones',
            menu: [
                { key: 'perfil', label: 'Perfil' },
                { key: 'direcciones', label: 'Direcciones' },
                { key: 'pagos', label: 'Medios de pago' },
                { key: 'autenticacion', label: 'Autenticación' },
                { key: 'pedidos', label: 'Pedidos' },
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
            this.user = null;
            window.location.href = '/';
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
