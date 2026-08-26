<template>
    <div v-if="sessionStatus === 'authenticated' && user" class="text-sunka-ink">
        <div class="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside
                class="overflow-hidden rounded-2xl border border-sunka-sand bg-sunka-white shadow-[0_18px_45px_rgba(35,29,24,0.07)] lg:sticky lg:top-28"
            >
                <div class="border-b border-sunka-sand px-6 py-6">
                    <p class="text-[9px] font-semibold uppercase tracking-[0.18em] text-sunka-brass">
                        Área personal
                    </p>
                    <h2 class="mt-2 font-heading text-2xl font-semibold text-sunka-forest">
                        Hola, {{ userName }}
                    </h2>
                    <p class="mt-1 text-xs leading-relaxed text-sunka-stone">
                        Gestiona tu cuenta SUNKA
                    </p>
                </div>

                <nav class="flex overflow-x-auto px-3 py-3 lg:block lg:overflow-visible">
                    <button
                        v-for="item in menu"
                        :key="item.key"
                        @click="active = item.key"
                        class="group flex shrink-0 cursor-pointer items-center gap-3 rounded-lg border-b-2 px-4 py-3 text-left text-[11px] font-semibold tracking-[0.03em] transition-colors lg:w-full lg:border-b-0 lg:border-l-2"
                        :class="[
                            active === item.key
                                ? 'border-sunka-brass bg-sunka-cream text-sunka-forest'
                                : 'border-transparent text-sunka-stone hover:bg-sunka-cream/60 hover:text-sunka-forest',
                        ]"
                    >
                        <span
                            class="h-1.5 w-1.5 shrink-0 rounded-full transition-colors"
                            :class="active === item.key ? 'bg-sunka-brass' : 'bg-sunka-sand group-hover:bg-sunka-brass'"
                        ></span>
                        {{ item.label }}
                    </button>
                </nav>

                <div class="border-t border-sunka-sand p-3">
                    <button
                        @click="logout"
                        class="w-full cursor-pointer rounded-lg px-4 py-3 text-left text-[11px] font-semibold tracking-[0.03em] text-[var(--sunka-danger)] transition-colors hover:bg-[#f8eee9]"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <section
                class="min-h-[520px] overflow-hidden rounded-2xl border border-sunka-sand bg-sunka-white p-5 shadow-[0_18px_45px_rgba(35,29,24,0.07)] sm:p-7 md:p-9"
            >
                <AccountPanelPerfil
                    v-if="active === 'perfil'"
                    :user="user"
                    :headText="menuText"
                    :documentos_identidad="documentos_identidad"
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
            </section>
        </div>
    </div>

    <div
        v-else-if="sessionStatus === 'loading'"
        class="rounded-2xl border border-sunka-sand bg-sunka-white px-6 py-16 text-center shadow-[0_18px_45px_rgba(35,29,24,0.07)]"
        role="status"
        aria-live="polite"
    >
        <span
            class="mx-auto block h-9 w-9 animate-spin rounded-full border-2 border-sunka-sand border-t-sunka-brass"
            aria-hidden="true"
        ></span>
        <p class="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-sunka-brass">
            Verificando sesión
        </p>
        <h2 class="mt-3 font-heading text-2xl font-semibold text-sunka-forest">
            Cargando tu cuenta…
        </h2>
        <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-sunka-stone">
            Estamos recuperando tus datos de forma segura.
        </p>
    </div>

    <div
        v-else-if="sessionStatus === 'error'"
        class="rounded-2xl border border-sunka-sand bg-sunka-white px-6 py-16 text-center shadow-[0_18px_45px_rgba(35,29,24,0.07)]"
        role="alert"
    >
        <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-sunka-brass">
            Conexión temporalmente interrumpida
        </p>
        <h2 class="mt-3 font-heading text-2xl font-semibold text-sunka-forest">
            No pudimos cargar tu cuenta
        </h2>
        <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-sunka-stone">
            Tu sesión no se ha cerrado. Intenta comprobarla nuevamente.
        </p>
        <button
            type="button"
            @click="validateSession"
            class="mt-6 h-11 cursor-pointer rounded-lg border border-sunka-ink bg-sunka-ink px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-sunka-white transition-colors hover:bg-sunka-forest"
        >
            Reintentar
        </button>
    </div>

    <div v-else class="rounded-2xl border border-sunka-sand bg-sunka-white px-6 py-16 text-center shadow-[0_18px_45px_rgba(35,29,24,0.07)]">
        <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-sunka-brass">Sesión</p>
        <h2 class="mt-3 font-heading text-2xl font-semibold text-sunka-forest">
            No has iniciado sesión
        </h2>
        <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-sunka-stone">
            Inicia sesión desde el ícono de usuario para acceder a la información de tu cuenta.
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { urls, get, post } from '../lib/api'
import { CheckoutDraft } from "../lib/checkout-draft";
import AccountPanelPerfil from "./AccountPanelPerfil.vue";
import AccountPanelDirecciones from "./AccountPanelDirecciones.vue";
import AccountPanelPagoMetodos from "./AccountPanelPagoMetodos.vue";
import AccountPanelPedidos from "./AccountPanelPedidos.vue";
import AccountPanelAutenticacion from "./AccountPanelAutenticacion.vue";

export default defineComponent({
    components: {
        AccountPanelPerfil,
        AccountPanelDirecciones,
        AccountPanelPagoMetodos,
        AccountPanelPedidos,
        AccountPanelAutenticacion,
    },
    props: {
        documentos_identidad: { type: Array, default: () => [] },
        initialUser: { type: Object, default: null },
        initialSessionStatus: { type: String, default: 'loading' },
    },
    data() {
        return {
            user: this.initialUser,
            sessionStatus: this.initialSessionStatus,
            active: "perfil",
            menu: [
                { key: "perfil", label: "Perfil" },
                { key: "direcciones", label: "Direcciones" },
                { key: "pago_metodos", label: "Medios de pago" },
                { key: "pedidos", label: "Pedidos" },
                { key: "autenticacion", label: "Autenticación" },
            ],
            errors: {},
        };
    },
    computed: {
        userName() {
            if (!this.user) return "";

            return this.user.nombres ? this.user.nombres : this.user.correo.split("@")[0];
        },
        menuText() {
            return this.menu.find((m) => m.key === this.active)?.label;
        },
    },
    mounted() {
        if (!['authenticated', 'guest'].includes(this.sessionStatus)) this.validateSession()

        const hash = window.location.hash.replace("#", "");
        if (hash === "pedidos") {
            this.active = "pedidos";
        }
    },
    methods: {
        async validateSession() {
            this.sessionStatus = 'loading'
            const res = await get(`${urls.account}/session`)
            if (res.ok) {
                this.user = res.data
                this.sessionStatus = 'authenticated'
            } else if (res.status === 401) {
                this.user = null
                this.sessionStatus = 'guest'
            } else {
                this.sessionStatus = 'error'
            }
        },
        async logout() {
            await post(`${urls.auth}/logout`, {}, false)
            CheckoutDraft.clear()
            window.location.href = '/'
            this.user = null
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
            const nuevoNombre = prompt("Editar nombre de dirección:", dir.nombre);
            if (nuevoNombre !== null && nuevoNombre.trim() !== "") {
                this.user.direcciones[index].nombre = nuevoNombre.trim();
            }
        },
        direccionMarcarPrincipal(index) {
            this.user.direcciones.forEach((d) => (d.principal = false));
            this.user.direcciones[index].principal = true;
        },
    },
})
</script>
