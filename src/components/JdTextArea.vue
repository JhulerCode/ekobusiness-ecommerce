<template>
    <div class="sunka-field">
        <label class="sunka-label" v-if="label">
            <span v-if="label">{{ label }}</span>
            <span v-if="nec" class="nec"> *</span>
        </label>

        <textarea
            v-if="!disabled"
            :placeholder="placeholder"
            v-model="inputModel"
            class="sunka-control resize-none"
            :aria-invalid="error ? 'true' : undefined"
        ></textarea>

        <div v-else class="sunka-control is-disabled">
            {{ inputModel }}
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
        icon: String,
        nec: { type: Boolean, default: false },
        tipo: { type: String, default: 'text' },
        placeholder: String,
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
};
</script>
