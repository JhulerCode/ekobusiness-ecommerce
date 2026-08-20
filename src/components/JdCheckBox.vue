<template>
    <div class="sunka-field">
        <label
            class="sunka-choice"
            :class="{ disabled: disabled }"
        >
            <input
                type="checkbox"
                v-model="inputModel"
                v-if="!disabled"
            />

            <span v-if="label" class="text-left">{{ label }}</span>
            <slot></slot>
        </label>

        <p v-if="error" class="sunka-error">
            {{ error }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: Boolean,

        label: String,
        disabled: { type: Boolean, default: false },
        error: { type: String, default: null },
    },
    computed: {
        inputModel: {
            get() {
                return this.modelValue;
            },
            set(newValue) {
                this.$emit("update:modelValue", newValue);
            },
        },
    },
};
</script>
