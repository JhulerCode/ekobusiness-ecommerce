<template>
    <div>
        <div class="flex justify-between mb-4">
            <h2 class="text-xl font-semibold capitalize">
                {{ headText }}
            </h2>

            <button @click="openModal" class="button">
                + Agregar dirección
            </button>
        </div>

        <div
            v-if="user.direcciones && user.direcciones.length > 0"
            class="space-y-4"
        >
            <div
                v-for="(dir, i) in user.direcciones"
                :key="i"
                class="flex justify-between items-start bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200"
            >
                <div>
                    <p class="font-medium text-gray-800">
                        {{ dir.nombre }}
                    </p>
                    <p class="text-sm text-gray-600">
                        {{ dir.calle }}
                    </p>
                    <p class="text-sm text-gray-600">
                        {{ dir.ciudad }}, {{ dir.region }} —
                        {{ dir.cp }}
                    </p>
                    <p class="text-sm text-gray-500 mt-1">
                        Teléfono: {{ dir.telefono }}
                    </p>
                    <span
                        v-if="dir.principal"
                        class="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-lg"
                    >
                        Principal
                    </span>
                </div>

                <div class="flex flex-col space-y-2">
                    <button
                        @click="direccionEditar(i)"
                        class="text-sm text-blue-600 hover:underline"
                    >
                        Editar
                    </button>
                    <button
                        @click="confirmarEliminar(i)"
                        class="text-sm text-red-500 hover:underline"
                    >
                        Eliminar
                    </button>
                    <button
                        v-if="!dir.principal"
                        @click="direccionMarcarPrincipal(i)"
                        class="text-sm text-gray-700 hover:text-black"
                    >
                        Marcar como principal
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="text-gray-600 text-center">
            <p>No tienes direcciones registradas.</p>
        </div>
    </div>

    <!-- Modal simple para agregar dirección -->
    <transition name="fade">
        <div
            v-if="showAddModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
            <div
                class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 py-4 px-6"
            >
                <div class="mb-4 pb-4 border-b border-gray-300">
                    <h3 class="text-lg font-semibold">Nueva dirección</h3>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="label">Nombre*</label>
                        <input v-model="form.nombre" class="input" />
                    </div>
                    <div class="col-span-2">
                        <label class="label">Dirección*</label>
                        <input v-model="form.calle" class="input" />
                    </div>

                    <div>
                        <label class="label">Número</label>
                        <input
                            v-model="form.direccion_numero"
                            type="text"
                            class="input"
                        />
                    </div>

                    <div>
                        <label class="label">Piso / Dpto</label>
                        <input
                            v-model="form.direccion_piso"
                            type="text"
                            class="input"
                        />
                    </div>

                    <div>
                        <label class="label">Referencia*</label>
                        <textarea
                            v-model="form.referencia"
                            class="input resize-none"
                            rows="1"
                        ></textarea>
                        <p v-if="errors.referencia" class="input-error">
                            {{ errors.referencia }}
                        </p>
                    </div>

                    <div>
                        <label class="label">Departamento*</label>
                        <input v-model="form.departamendo" class="input" />
                    </div>

                    <div>
                        <label class="label">Provincia*</label>
                        <input v-model="form.provincia" class="input" />
                    </div>

                    <div>
                        <label class="label">Distrito*</label>
                        <input
                            v-model="form.distrito"
                            type="text"
                            class="input"
                        />
                        <p v-if="errors.distrito" class="input-error">
                            {{ errors.distrito }}
                        </p>
                    </div>

                    <div class="col-span-2">
                        <label class="checkbox">
                            <input type="checkbox" v-model="form.principal" />
                            <span>Principal</span>
                        </label>
                    </div>
                </div>

                <div
                    class="mt-4 pt-4 border-t border-gray-300 flex justify-end gap-3"
                >
                    <button @click="cancelAdd" class="button2">Cancelar</button>
                    <button @click="addDireccion" class="button">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { urls, get } from '../lib/api.js';

export default {
    props: {
        headText: { type: String, default: '' },
        user: { type: Object, default: () => ({}) },
    },
    data() {
        return {
            showAddModal: false,
            form: {
                nombre: '',
                calle: '',
                ciudad: '',
                region: '',
                cp: '',
                telefono: '',
                principal: false,
            },
            errors: {},
        };
    },
    methods: {
        openModal() {
            this.showAddModal = true;
            document.body.style.overflow = 'hidden'; // evita scroll en fondo
        },
        cancelAdd() {
            this.showAddModal = false;
            document.body.style.overflow = '';
            this.resetNewAddress();
        },
        resetNewAddress() {
            this.form = {
                nombre: '',
                calle: '',
                ciudad: '',
                region: '',
                cp: '',
                telefono: '',
                principal: false,
            };
        },

        validateForm() {
            Object.keys(this.errors).forEach((k) => (this.errors[k] = ''));

            if (!this.form.nombre)
                this.errors.nombre = 'Este campo es obligatorio.';
            if (!this.form.direccion)
                this.errors.direccion = 'Este campo es obligatorio.';
            if (!this.form.referencia)
                this.errors.referencia = 'Este campo es obligatorio.';
            if (!this.form.direccion_numero)
                this.errors.direccion_numero = 'Este campo es obligatorio.';
            if (!this.form.direccion_piso)
                this.errors.direccion_piso = 'Este campo es obligatorio.';
            if (!this.form.departamento)
                this.errors.departamento = 'Este campo es obligatorio.';
            if (!this.form.provincia)
                this.errors.provincia = 'Este campo es obligatorio.';
            if (!this.form.distrito)
                this.errors.distrito = 'Este campo es obligatorio.';

            return Object.values(this.errors).every((e) => !e);
        },
        addDireccion() {
            // validación mínima
            if (!this.form.nombre || !this.form.calle) {
                alert('Completa al menos nombre y calle.');
                return;
            }

            // Si marca como principal, desmarcar otras
            if (this.form.principal && this.user.direcciones) {
                this.user.direcciones.forEach((d) => (d.principal = false));
            }

            // Asegura que exista el array
            if (!this.user.direcciones) this.user.direcciones = [];

            // Inserta la nueva dirección al inicio (o push según prefieras)
            this.user.direcciones.unshift({ ...this.form });

            // Opcional: llamar API para persistir
            // await post(`${urls.account}/direcciones`, this.form, token);

            this.resetNewAddress();
            this.showAddModal = false;
        },
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
};
</script>
