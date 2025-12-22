<template>
    <div class="border-y border-gray-200 py-4 px-6">
        <div class="flex flex-wrap items-center gap-4">
            <button
                @click="setFiltro('todos')"
                :class="[
                    'px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer',
                    filtro === 'todos'
                        ? 'bg-black text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100',
                ]"
            >
                Todos
            </button>

            <button
                v-for="linea in lineas"
                :key="linea.slug"
                @click="setFiltro(linea.id)"
                :class="[
                    'px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer',
                    filtro === linea.id
                        ? 'bg-black text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100',
                ]"
            >
                {{ linea.nombre }}
            </button>
        </div>
    </div>

    <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6"
    >
        <Producto
            v-for="item in productosFiltrados"
            :key="item.id"
            :producto="item"
            v-if="productosFiltrados.length > 0"
        />

        <div v-else>No hay productos disponibles</div>
    </div>
</template>

<script>
import Producto from './Producto.vue';

export default {
    components: {
        Producto,
    },
    props: {
        productos: {
            type: Array,
            required: true,
            default: () => [],
        },
        lineas: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    data() {
        return {
            filtro: 'todos',
        };
    },
    computed: {
        productosFiltrados() {
            if (this.filtro === 'todos') return this.productos;

            return this.productos.filter(
                (p) => p.linea == this.filtro
            );
        },
    },
    methods: {
        setFiltro(id) {
            this.filtro = id;
        },
    },
};
</script>
