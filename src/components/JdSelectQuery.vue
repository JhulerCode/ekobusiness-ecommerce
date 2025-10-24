<template>
    <div>
        <div class="flex justify-between items-center gap-2">
            <label class="label" v-if="label">
                <span v-if="label">{{ label }}</span>
                <span v-if="nec">*</span>
            </label>

            <!-- Botones / acciones -->
            <div v-if="!disabled" class="flex items-center gap-2">
                <Xmark
                    class="w-4 h-4 cursor-pointer"
                    v-if="inputModel"
                    @click.stop="setNull()"
                />
            </div>
        </div>

        <template v-if="!disabled">
            <!-- Texto mostrado -->
            <div
                class="relative input overflow-x-auto whitespace-nowrap no-scrollbar"
                v-if="inputModel"
                :title="setMostrar()"
            >
                {{ setMostrar() }}
            </div>

            <input
                type="search"
                class="input"
                v-model="txtBuscar"
                @input="handleInput()"
                :placeholder="placeholder"
                v-else
                ref="right"
            />

            <!-- Lista desplegable -->
            <div
                v-if="isVisible"
                ref="lista-box"
                class="absolute z-30 bg-white shadow-lg border border-gray-300 w-full"
            >
                <LoadingSpin
                    borderRadius="0.2rem"
                    :shadowBack="false"
                    :rellenar="false"
                    class="p-1"
                    v-if="spin"
                />

                <ul class="max-h-52 overflow-y-auto text-sm">
                    <li
                        v-if="lista.length === 0"
                        class="px-2 py-1 text-gray-400"
                    >
                        Sin resultados
                    </li>

                    <li
                        v-else
                        v-for="(a, i) in lista"
                        :key="i"
                        @click="elegir(a[id])"
                        class="px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-md"
                    >
                        {{ a[mostrar] }}
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
import LoadingSpin from './LoadingSpin.vue';
import Xmark from '../assets/icons/Xmark.vue';

export default {
    components: {
        LoadingSpin,
        Xmark,
    },
    props: {
        modelValue: [String, Number],

        label: String,
        icon: String,
        nec: { type: Boolean, default: false },
        spin: { type: Boolean, default: false },
        lista: { type: Array, default: () => [] },
        id: { type: String, default: 'id' },
        mostrar: { type: String, default: 'nombre' },
        placeholder: { type: String, default: null },
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
    },
    data: () => ({
        isVisible: false,
        txtBuscar: '',
        searchTimeOut: null,
    }),
    mounted() {
        this.init(this.inputModel);
    },
    methods: {
        handleClickOutside(event) {
            const el = this.$refs['lista-box'];

            if (el && !el.contains(event.target)) {
                this.ocultar();
            }
        },
        handleEscapeKey(event) {
            if (event.key === 'Escape' || event.keyCode === 27) {
                this.ocultar();
            }
        },
        toogleList() {
            // this.isVisible = !this.isVisible

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
            if (id) {
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
            this.inputModel = id;

            this.$emit(
                'elegir',
                this.lista.find((a) => a[this.id] == id)
            );

            this.ocultar();
        },
        setNull() {
            this.inputModel = null;

            this.$emit('elegir', null);
        },

        handleInput() {
            clearTimeout(this.searchTimeOut);

            if (this.txtBuscar == '') {
                this.isVisible = false;
                this.toogleList();
                this.$emit('search');
                return;
            }

            this.isVisible = true;
            this.toogleList();
            this.searchTimeOut = setTimeout(() => {
                this.search();
            }, 500);
        },
        setMostrar() {
            if (this.inputModel) {
                const send = this.lista.find(
                    (a) => a[this.id] == this.inputModel
                );

                if (send) {
                    return send[this.mostrar];
                } else {
                    return '';
                }
            }
        },
        async search() {
            this.$emit('search', this.txtBuscar);
        },
    },
};
</script>
