<template>
    <div>
        <div class="flex justify-between mb-4">
            <h2 class="text-xl font-semibold capitalize">
                {{ headText }}
            </h2>

            <button @click="showAddModal = true" class="button">
                Editar
            </button>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
            <div>
                <label class="label">Nombres:</label>
                <p>{{ user.nombres ? user.nombres : '-' }}</p>
                <input
                    v-model="user.nombres"
                    type="text"
                    class="input"
                    v-if="editing"
                />
                <p v-if="errors.nombres" class="input-error">
                    {{ errors.nombres }}
                </p>
            </div>
    
            <div>
                <label class="label">Apellidos:</label>
                <p>{{ user.apellidos ? user.apellidos : '-' }}</p>
                <input
                    v-model="user.apellidos"
                    type="text"
                    class="input"
                    v-if="editing"
                />
                <p v-if="errors.apellidos" class="input-error">
                    {{ errors.apellidos }}
                </p>
            </div>
    
            <div>
                <label class="label">Tipo de documento:</label>
                <p>{{ user.doc_tipo ? user.doc_tipo : '-' }}</p>
                <select v-model="user.doc_tipo" class="input" v-if="editing">
                    <option value="DNI">DNI</option>
                    <option value="CE">Carné de Extranjería</option>
                    <option value="PAS">Pasaporte</option>
                </select>
                <p v-if="errors.doc_tipo" class="input-error">
                    {{ errors.doc_tipo }}
                </p>
            </div>
    
            <div>
                <label class="label">Número de documento:</label>
                <p>{{ user.doc_numero ? user.doc_numero : '-' }}</p>
                <input
                    v-model="user.doc_numero"
                    type="text"
                    class="input"
                    v-if="editing"
                />
                <p v-if="errors.doc_numero" class="input-error">
                    {{ errors.doc_numero }}
                </p>
            </div>
    
            <div>
                <label class="label">Correo:</label>
                <p>{{ user.correo }}</p>
                <input
                    v-model="user.correo"
                    type="email"
                    class="input"
                    v-if="editing"
                />
                <p v-if="errors.correo" class="input-error">
                    {{ errors.correo }}
                </p>
            </div>
    
            <div>
                <label class="label">Teléfono:</label>
                <p>{{ user.telefono1 ? user.telefono1 : '-' }}</p>
                <input
                    v-model="user.telefono1"
                    type="text"
                    class="input"
                    v-if="editing"
                />
                <p v-if="errors.telefono1" class="input-error">
                    {{ errors.telefono1 }}
                </p>
            </div>
        </div>
    </div>
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
            errors: {},
            editing: false,
        };
    },
    methods: {},
};
</script>
