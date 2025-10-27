<template>
    <div>
        <label class="label" v-if="label">
            <span v-if="label">{{ label }}</span>
            <span v-if="nec" class="nec"> *</span>
        </label>

        <textarea
            v-if="!disabled"
            :placeholder="placeholder"
            v-model="inputModel"
            class="input resize-none"
        ></textarea>

        <div v-else>
            {{ inputModel }}
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
