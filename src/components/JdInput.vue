<template>
    <div>
        <label class="label" v-if="label">
            <span v-if="label">{{ label }}</span>
            <span v-if="nec" class="nec"> *</span>
        </label>

        <input
            v-if="!disabled"
            :type="type"
            :placeholder="placeholder"
            v-model="inputModel"
            class="input"
            :class="{ 'to-right': toRight }"
            :maxlength="maxlength"
        />

        <div
            v-else
            class="overflow-x-auto whitespace-nowrap no-scrollbar"
            :class="{ 'to-right-p': toRight }"
        >
            <template
                v-if="
                    ['text', 'number', 'email', 'hour', 'search'].includes(type)
                "
            >
                {{ inputModel ? inputModel : '-' }}
            </template>

            <template v-else-if="type == 'date'">
                {{ dayjs(inputModel).format('DD-MM-YYYY') }}
            </template>

            <template v-else-if="type == 'datetime-local'">
                {{ dayjs(inputModel).format(`${'DD-MM-YYYY'} HH:mm:ss`) }}
            </template>
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

        icon: String,
        label: String,
        nec: { type: Boolean, default: false },
        type: { type: String, default: 'text' },
        placeholder: String,
        disabled: { type: Boolean, default: false },
        toRight: { type: Boolean, default: false },
        error: { type: String, default: null },
        maxlength: { type: [String, Number], default: null },
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
    data: () => ({}),
    methods: {
        dayjs(date) {
            return date;
        },
    },
};
</script>
