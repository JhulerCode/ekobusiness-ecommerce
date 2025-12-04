<template>
    <div>
        <label class="label" v-if="label">
            <span v-if="label">{{ label }}</span>
            <span v-if="nec" class="nec"> *</span>
        </label>

        <div class="relative w-full">
            <!-- Track vacío (gris) -->
            <div
                class="absolute top-1/2 -translate-y-1/2 w-full h-[4px] bg-gray-300 rounded-full"
            ></div>

            <!-- Track lleno (verde) -->
            <div
                class="absolute top-1/2 -translate-y-1/2 h-[4px] bg-black rounded-full"
                :style="{ width: filledWidth + '%' }"
            ></div>

            <!-- Input transparente -->
            <input
                type="range"
                v-model="inputModel"
                :min="number_min"
                :max="number_max"
                class="w-full appearance-none bg-transparent relative z-10 cursor-pointer /* WebKit */ [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black /* Firefox */ [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black"
            />
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
        disabled: Boolean,
        nec: Boolean,
        error: String,

        number_min: { type: [String, Number], default: 0 },
        number_max: { type: [String, Number], default: 100 },
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

        filledWidth() {
            const min = Number(this.number_min);
            const max = Number(this.number_max);
            return ((this.inputModel - min) / (max - min)) * 100;
        },
    },
    data: () => ({}),
};
</script>
