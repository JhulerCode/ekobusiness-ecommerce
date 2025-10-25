<template>
    <div>
        <label class="label" v-if="label">
            <span v-if="label">{{ label }}</span>
            <span v-if="nec" class="nec"> *</span>
        </label>

        <div v-if="!disabled" class="relative">
            <input
                :type="tipo_input"
                :placeholder="placeholder"
                v-model="inputModel"
                :maxlength="maxlength"
                class="input"
            />

            <button
                type="button"
                @click="showPass"
                class="absolute right-3 top-2 text-gray-500 cursor-pointer hover:text-black"
            >
                <EyeOpen v-if="ver_pass" />
                <EyeCancel v-else />
            </button>
        </div>

        <div
            v-else
            class="overflow-x-auto whitespace-nowrap no-scrollbar"
            :class="{ 'to-right-p': toRight }"
        >
            <template>
                {{ inputModel ? inputModel : '-' }}
            </template>
        </div>

        <p v-if="error" class="input-error">
            {{ error }}
        </p>
    </div>
</template>

<script>
import EyeOpen from '../assets/icons/eye-open.vue';
import EyeCancel from '../assets/icons/eye-cancel.vue';

export default {
    components: {
        EyeOpen,
        EyeCancel,
    },
    props: {
        modelValue: [String, Number],

        icon: String,
        label: String,
        nec: { type: Boolean, default: false },
        placeholder: String,
        disabled: { type: Boolean, default: false },
        toRight: { type: Boolean, default: false },
        error: { type: String, default: null },
        maxlength: { type: Number, default: null },
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
        tipo_input: 'password',
        ver_pass: false,
    }),
    methods: {
        showPass() {
            this.ver_pass = !this.ver_pass;
            this.tipo_input = this.ver_pass ? 'text' : 'password';
        },
    },
};
</script>
