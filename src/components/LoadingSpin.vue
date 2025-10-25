<template>
    <div
        :class="[
            'flex items-center justify-center',
            { 'fixed inset-0 z-50': rellenar },
            { 'bg-black/30': shadowBack },
        ]"
    >
        <div
            class="flex items-center justify-center"
            :style="{ transform: `scale(${scale})` }"
        >
            <!-- Spinner -->
            <div
                class="w-6 h-6 border-[0.3rem] border-gray-200 border-t-gray-400 rounded-full animate-spin [animation-duration:0.5s]"
            ></div>
        </div>

        <!-- Texto opcional -->
        <div v-if="text" class="mt-4 text-gray-700 text-sm">
            {{ text }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        text: { type: String, default: '' },
        rellenar: { type: Boolean, default: true },
        shadowBack: { type: Boolean, default: true },
        scale: { type: [String, Number], default: 1 },
    },
};
</script>
