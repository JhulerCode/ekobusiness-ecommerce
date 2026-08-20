<template>
    <div class="sunka-field">
        <label class="sunka-label" v-if="label">
            <span v-if="label">{{ label }}</span>
            <span v-if="nec" class="nec"> *</span>
        </label>

        <input
            v-if="!disabled"
            :type="type"
            :placeholder="placeholder"
            v-model="inputModel"
            class="sunka-control"
            :class="{ 'to-right': toRight }"
            :aria-invalid="error ? 'true' : undefined"
            :maxlength="maxlength"
            :number_min="number_min"
            :number_max="number_max"
        />

        <div
            v-else
            class="sunka-control is-disabled overflow-x-auto whitespace-nowrap no-scrollbar"
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

        <p v-if="error" class="sunka-error">
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

        number_min: { type: [String, Number], default: null },
        number_max: { type: [String, Number], default: null },
        modelModifiers: { type: Object, default: () => ({}) },
    },
    computed: {
        inputModel: {
            get() {
                return this.modelValue;
            },
            set(newValue) {
                let value = newValue;
                if (this.modelModifiers.trim && typeof value === 'string') value = value.trim();
                if (this.modelModifiers.number) value = Number(value);
                this.$emit('update:modelValue', value);
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
