<template>
    <div>
        <label class="label" v-if="label">
            <span v-if="label">{{ label }}</span>
            <span v-if="nec" class="nec"> *</span>
        </label>

        <div :class="['flex', row ? 'gap-4' : 'flex-col gap-2']">
            <label
                v-for="a in lista"
                :key="a.id"
                :class="[
                    'radio',
                    withBorder ? 'border border-gray-300 rounded-xl p-4' : '',
                ]"
            >
                <input v-model="inputModel" type="radio" :value="a.id" />

                <span class="text-left">
                    <template v-if="a.descripcion">
                        <strong>{{ a.nombre }}:</strong> {{ a.descripcion }}
                    </template>

                    <template v-else>
                        {{ a.nombre }}
                    </template>
                </span>
            </label>
        </div>

        <p v-if="error" class="input-error">
            {{ error }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: [String, Number],

        label: String,
        nec: { type: Boolean, default: false },
        lista: { type: Array, default: () => [] },
        disabled: { type: Boolean, default: false },
        error: { type: String },
        withBorder: { type: Boolean, default: false },
        row: { type: Boolean, default: false },
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
};
</script>
