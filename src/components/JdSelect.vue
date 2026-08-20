<template>
    <div class="sunka-field">
        <div class="flex items-center justify-between gap-2">
            <label v-if="label" class="sunka-label">
                <span>{{ label }}</span>
                <span v-if="nec" class="nec">*</span>
            </label>

            <div v-if="!disabled" class="flex items-center gap-2">
                <button
                    v-if="loaded"
                    type="button"
                    class="cursor-pointer text-sunka-stone hover:text-sunka-ink"
                    title="Recargar"
                    aria-label="Recargar opciones"
                    @click="reload"
                >
                    R
                </button>
                <button
                    v-if="hasValue"
                    type="button"
                    class="cursor-pointer text-sunka-stone hover:text-sunka-ink"
                    title="Limpiar selección"
                    aria-label="Limpiar selección"
                    @click="setNull"
                >
                    <Xmark class="h-4 w-4" />
                </button>
            </div>
        </div>

        <select
            v-model="inputModel"
            class="sunka-control cursor-pointer"
            :disabled="disabled"
            :aria-invalid="error ? 'true' : undefined"
            @change="emitSelection"
        >
            <option :value="null">{{ placeholder || 'Selecciona una opción' }}</option>

            <option v-for="item in opcionesSimples" :key="item[id]" :value="item[id]">
                {{ getNestedProp(item, mostrar) }}
            </option>

            <optgroup
                v-for="(group, groupName) in opcionesAgrupadas"
                :key="groupName"
                :label="groupName"
            >
                <option v-for="item in group" :key="item[id]" :value="item[id]">
                    {{ getNestedProp(item, mostrar) }}
                </option>
            </optgroup>
        </select>

        <p v-if="error" class="sunka-error">
            {{ error }}
        </p>
    </div>
</template>

<script>
import Xmark from '../assets/icons/xmark.vue'

export default {
    components: { Xmark },
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
                return this.modelValue
            },
            set(newValue) {
                this.$emit('update:modelValue', newValue)
            },
        },
        hasValue() {
            return (
                this.inputModel !== null &&
                this.inputModel !== undefined &&
                this.inputModel !== ''
            )
        },
        opcionesSimples() {
            return this.groupBy ? [] : this.lista
        },
        opcionesAgrupadas() {
            if (!this.groupBy) return {}

            return this.lista.reduce((groups, item) => {
                const groupName = this.getNestedProp(item, this.groupBy) || 'Sin agrupar'
                if (!groups[groupName]) groups[groupName] = []
                groups[groupName].push(item)
                return groups
            }, {})
        },
    },
    methods: {
        emitSelection(event) {
            const selectedId = event.target.value
            this.$emit(
                'elegir',
                this.lista.find((item) => item[this.id] == selectedId) || null,
            )
        },
        setNull() {
            this.inputModel = null
            this.$emit('elegir', null)
        },
        getNestedProp(object, path) {
            const result = path.split('.').reduce((value, part) => value?.[part], object)
            return result === undefined || result === null ? '' : result
        },
        reload() {
            this.$emit('reload')
        },
    },
}
</script>
