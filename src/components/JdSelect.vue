<template>
    <div>
        <div class="flex justify-between items-center gap-2">
            <label v-if="label" class="label">
                <span>{{ label }}</span>
                <span v-if="nec">*</span>
            </label>

            <div v-if="!disabled" class="flex items-center gap-2">
                <i
                    v-if="loaded"
                    class="fa-solid fa-rotate-right cursor-pointer hover:text-gray-900"
                    title="Recargar"
                    @click.stop="reload()"
                    >R</i
                >
                <Xmark
                    v-if="inputModel"
                    class="w-4 h-4 cursor-pointer"
                    @click.stop="setNull()"
                />
            </div>
        </div>

        <template v-if="!disabled">
            <div
                ref="right"
                class="relative input overflow-x-auto whitespace-nowrap no-scrollbar cursor-pointer"
                @click="toogleList"
                :title="mostrarValor"
            >
                {{ mostrarValor ? mostrarValor : '-' }}

                <div class="absolute right-2 top-3">
                    <ChevronUp v-if="isVisible" class="w-4 h-4 text-gray-400" />
                    <ChevronDown v-else class="w-4 h-4 text-gray-400" />
                </div>
            </div>

            <!-- Lista desplegable -->
            <div
                v-if="isVisible"
                ref="lista-box"
                class="absolute bg-white shadow-lg border border-gray-300 w-full"
            >
                <input
                    v-if="lista.length > 10"
                    type="search"
                    placeholder="Buscar..."
                    v-model="txtBuscar"
                    class="w-full mb-2 border border-gray-300 rounded-md px-2 py-1 text-sm"
                />

                <!-- Lista simple -->
                <ul v-if="!groupBy" class="max-h-52 overflow-y-auto text-sm">
                    <li
                        v-if="lista.length === 0"
                        class="px-2 py-1 text-gray-400"
                    >
                        Sin datos
                    </li>

                    <li
                        v-else-if="listaFiltrada.length === 0"
                        class="px-2 py-1 text-gray-400"
                    >
                        Sin resultados
                    </li>

                    <li
                        v-else
                        v-for="(a, i) in listaFiltrada"
                        :key="i"
                        @click="elegir(a[id])"
                        :class="[
                            'px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-md',
                            inputModel == a[id]
                                ? 'text-blue-600 font-semibold'
                                : '',
                        ]"
                    >
                        {{ getNestedProp(a, mostrar) }}
                    </li>
                </ul>

                <!-- Lista agrupada -->
                <ul v-else class="max-h-52 overflow-y-auto text-sm">
                    <li
                        v-for="(group, groupName) in listaAgrupada"
                        :key="groupName"
                        class="mb-1"
                    >
                        <ul>
                            <li
                                class="px-2 py-1 font-semibold text-gray-500 cursor-default"
                            >
                                {{ groupName }}
                            </li>
                            <li
                                v-for="(a, i) in group"
                                :key="i"
                                @click="elegir(a[id])"
                                :class="[
                                    'ml-2 px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-md',
                                    inputModel == a[id]
                                        ? 'text-blue-600 font-semibold'
                                        : '',
                                ]"
                            >
                                {{ getNestedProp(a, mostrar) }}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </template>

        <div
            v-else
            class="whitespace-nowrap overflow-x-auto no-scrollbar"
            :title="mostrarValor"
        >
            {{ mostrarValor ? mostrarValor : '-' }}
        </div>

        <p v-if="error" class="input-error">
            {{ error }}
        </p>
    </div>
</template>

<script>
import Xmark from '../assets/icons/Xmark.vue';
import ChevronUp from '../assets/icons/chevron-up.vue';
import ChevronDown from '../assets/icons/chevron-down.vue';

export default {
    components: {
        Xmark,
        ChevronUp,
        ChevronDown,
    },
    props: {
        modelValue: [String, Number, Boolean],
        label: String,
        icon: String,
        nec: { type: Boolean, default: false },
        loaded: { type: Boolean, default: false },
        lista: { type: Array, default: () => [] },
        id: { type: String, default: 'id' },
        mostrar: { type: String, default: 'nombre' },
        placeholder: { type: String, default: null },
        groupBy: { type: String, default: null },
        disabled: { type: Boolean, default: false },
        error: { type: String, default: null },
    },
    computed: {
        inputModel: {
            get() {
                return this.modelValue;
            },
            set(newValue) {
                this.$emit('update:modelValue', newValue);
            },
        },
        mostrarValor() {
            if (
                this.inputModel !== null &&
                this.inputModel !== undefined &&
                this.inputModel !== ''
            ) {
                const send = this.lista.find(
                    (a) => a[this.id] == this.inputModel
                );
                if (send) {
                    return this.getNestedProp(send, this.mostrar);
                }
            }
            return '';
        },
        listaFiltrada() {
            if (!this.txtBuscar) return this.lista;
            const textoBuscado = this.normalizarTexto(this.txtBuscar);
            return this.lista.filter((a) => {
                const valor = this.getNestedProp(a, this.mostrar);
                return this.normalizarTexto(valor).includes(textoBuscado);
            });
        },
        listaAgrupada() {
            if (!this.groupBy) return {};
            const grouped = this.listaFiltrada.reduce((acc, item) => {
                const groupName = item[this.groupBy] || 'Sin agrupar';
                if (!acc[groupName]) acc[groupName] = [];
                acc[groupName].push(item);
                return acc;
            }, {});
            return grouped;
        },
    },
    data: () => ({
        isVisible: false,
        txtBuscar: '',
    }),
    mounted() {
        this.init(this.inputModel);
    },
    methods: {
        handleClickOutside(event) {
            const el = this.$refs['lista-box'];
            if (el && !el.contains(event.target)) this.ocultar();
        },
        handleEscapeKey(event) {
            if (event.key === 'Escape' || event.keyCode === 27) this.ocultar();
        },
        toogleList() {
            if (this.disabled) return;
            this.isVisible = !this.isVisible;

            if (this.isVisible) {
                this.$nextTick(() => {
                    const rect = this.$refs.right.getBoundingClientRect();
                    const el = this.$refs['lista-box'];
                    el.style.top = `${rect.bottom + window.scrollY}px`;
                    el.style.left = `${rect.left + window.scrollX}px`;
                    el.style.width = `${rect.width}px`;
                });

                setTimeout(() => {
                    document.addEventListener('click', this.handleClickOutside);
                    window.addEventListener('keydown', this.handleEscapeKey);
                }, 0);
            } else {
                this.ocultar();
            }
        },
        ocultar() {
            this.isVisible = false;
            this.txtBuscar = '';
            document.removeEventListener('click', this.handleClickOutside);
            window.removeEventListener('keydown', this.handleEscapeKey);
        },
        init(id) {
            if (id !== null && id !== undefined) {
                if (this.lista.length > 0) {
                    this.inputModel = id;
                } else {
                    const inter = setInterval(() => {
                        if (this.lista.length > 0) {
                            this.inputModel = id;
                            clearInterval(inter);
                        }
                    }, 100);
                }
            }
        },
        elegir(id) {
            const isChanged = id !== this.inputModel;
            this.inputModel = id;
            if (isChanged) {
                this.$emit(
                    'elegir',
                    this.lista.find((a) => a[this.id] == id)
                );
            }
            this.ocultar();
        },
        setNull() {
            this.inputModel = null;
            this.$emit('elegir', null);
        },
        getNestedProp(obj, prop) {
            const result = prop
                .split('.')
                .reduce((acc, part) => acc?.[part], obj);
            return result === undefined || result === null ? '' : result;
        },
        normalizarTexto(texto) {
            return texto
                .toString()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase();
        },
        reload() {
            this.$emit('reload');
        },
    },
};
</script>
