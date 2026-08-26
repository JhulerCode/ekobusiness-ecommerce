<template>
    <div class="sunka-field" @click="handleControlClick">
        <div class="flex justify-between items-center gap-2">
            <label class="sunka-label" v-if="label">
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
                class="sunka-control relative overflow-x-auto whitespace-nowrap no-scrollbar"
                :class="{ 'is-open': isVisible }"
                v-if="inputModel"
                :title="setMostrar()"
                ref="right"
                tabindex="0"
                role="combobox"
                :aria-expanded="isVisible"
                :aria-invalid="error ? 'true' : undefined"
                @keydown.enter.prevent="openList"
                @keydown.space.prevent="openList"
                @keydown.down.prevent="openList"
            >
                {{ setMostrar() }}
            </div>

            <input
                type="search"
                class="sunka-control"
                :class="{ 'is-open': isVisible }"
                v-model="txtBuscar"
                @input="handleInput()"
                :placeholder="placeholder"
                v-else
                ref="right"
                role="combobox"
                :aria-expanded="isVisible"
                :aria-invalid="error ? 'true' : undefined"
            />

            <!-- Lista desplegable -->
            <Teleport v-if="isMounted" to="body">
                <div
                    v-if="isVisible"
                    ref="lista-box"
                    class="fixed z-[200] border border-sunka-sand bg-sunka-white shadow-[0_14px_35px_rgba(35,29,24,0.16)]"
                >
                    <LoadingSpin
                        borderRadius="0.2rem"
                        :shadowBack="false"
                        :rellenar="false"
                        class="p-1"
                        v-if="spin"
                    />

                    <ul class="max-h-52 overflow-y-auto py-1 text-sm">
                        <li
                            v-if="lista.length === 0"
                            class="px-3 py-2 text-sunka-stone"
                        >
                            Sin resultados
                        </li>

                        <li
                            v-else
                            v-for="(a, i) in lista"
                            :key="i"
                            @click="elegir(a[id])"
                            class="cursor-pointer px-3 py-2 text-sunka-ink transition-colors hover:bg-sunka-cream"
                        >
                            {{ a[mostrar] }}
                        </li>
                    </ul>
                </div>
            </Teleport>
        </template>

        <div
            v-else
            class="sunka-control is-disabled whitespace-nowrap overflow-x-auto no-scrollbar"
            :title="mostrarValor"
        >
            {{ mostrarValor ? mostrarValor : '-' }}
        </div>

        <p v-if="error" class="sunka-error">
            {{ error }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LoadingSpin from './LoadingSpin.vue';
import Xmark from '../assets/icons/xmark.vue';

export default defineComponent({
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
        isMounted: false,
        isVisible: false,
        txtBuscar: '',
        searchTimeOut: null,
    }),
    mounted() {
        this.isMounted = true
        this.init(this.inputModel);
    },
    beforeUnmount() {
        this.removeGlobalListeners()
    },
    watch: {
        lista() {
            if (this.isVisible) this.$nextTick(this.updateListPosition)
        },
    },
    methods: {
        handleControlClick(event) {
            if (this.disabled || !event.target.closest?.('.sunka-control')) return;

            this.openList();
        },
        handleClickOutside(event) {
            const trigger = this.$refs.right;
            const list = this.$refs['lista-box'];

            if (!trigger?.contains(event.target) && !list?.contains(event.target)) {
                this.ocultar();
            }
        },
        handleEscapeKey(event) {
            if (event.key === 'Escape' || event.keyCode === 27) {
                this.ocultar();
            }
        },
        openList() {
            if (this.disabled) return;

            this.isVisible = true;

            if (this.isVisible) {
                this.$nextTick(this.updateListPosition)

                setTimeout(() => {
                    document.addEventListener('click', this.handleClickOutside);
                    window.addEventListener('keydown', this.handleEscapeKey);
                    window.addEventListener('resize', this.updateListPosition)
                    document.addEventListener('scroll', this.updateListPosition, true)
                }, 0);
            }
        },
        updateListPosition() {
            const trigger = this.$refs.right
            const list = this.$refs['lista-box']
            if (!trigger || !list) return

            const rect = trigger.getBoundingClientRect()
            const gap = 4
            const viewportPadding = 8
            const listHeight = Math.min(list.scrollHeight, 208)
            const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
            const shouldOpenAbove = spaceBelow < Math.min(listHeight, 160) && rect.top > spaceBelow

            list.style.top = shouldOpenAbove
                ? `${Math.max(viewportPadding, rect.top - listHeight - gap)}px`
                : `${rect.bottom + gap}px`
            list.style.left = `${rect.left}px`
            list.style.width = `${rect.width}px`
        },
        removeGlobalListeners() {
            document.removeEventListener('click', this.handleClickOutside)
            window.removeEventListener('keydown', this.handleEscapeKey)
            window.removeEventListener('resize', this.updateListPosition)
            document.removeEventListener('scroll', this.updateListPosition, true)
        },
        ocultar() {
            this.isVisible = false;
            this.txtBuscar = '';

            this.removeGlobalListeners()
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

            this.openList();

            if (this.txtBuscar == '') {
                this.$emit('search');
                return;
            }

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
})
</script>
