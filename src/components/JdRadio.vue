<template>
    <div class="sunka-field">
        <label class="sunka-label" v-if="label">
            <span v-if="label">{{ label }}</span>
            <span v-if="nec" class="nec"> *</span>
        </label>

        <div :class="['flex', row ? 'gap-4' : 'flex-col gap-2']">
            <label
                v-for="a in lista"
                :key="a.id"
                :class="[
                    'sunka-choice',
                    withBorder ? 'border border-sunka-sand p-4' : '',
                ]"
            >
                <input v-model="inputModel" type="radio" :value="a.id" :disabled="disabled" />

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

        <p v-if="error" class="sunka-error">
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
