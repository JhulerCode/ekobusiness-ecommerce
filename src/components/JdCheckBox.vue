<template>
    <div>
        <label
            class="text-sm text-gray-600 cursor-pointer select-none flex items-start gap-2"
            :class="{ disabled: disabled }"
        >
            <input
                type="checkbox"
                v-model="inputModel"
                v-if="!disabled"
                class="appearance-none w-4 h-4 rounded-md border relative flex-shrink-0 cursor-pointer before:content-['✓'] before:absolute before:text-[10px] before:inset-0 before:flex before:items-center before:justify-center checked:before:opacity-100 before:opacity-0 transition-all bg-white text-black placeholder-gray-500 border-neutral-300 focus:ring-neutral-800 before:text-black"
            />

            <span v-if="label" class="text-left">{{ label }}</span>
            <slot></slot>
        </label>

        <p v-if="error" class="input-error">
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
                this.$emit('update:modelValue', newValue);
            },
        },
    },
};
</script>
