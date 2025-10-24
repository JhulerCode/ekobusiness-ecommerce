<template>
    <div
        :title="title"
        :class="[
            'px-4 py-1.5 rounded-lg cursor-pointer flex justify-center items-center gap-2 border',
            tipo == 1
                ? 'border-black bg-black text-white hover:bg-gray-800'
                : 'border-gray-300 hover:text-blac',
        ]"
    >
        <LoadingSpin scale="0.7" v-if="loading" />

        <span v-if="text">{{ text }}</span>
    </div>
</template>

<script>
import LoadingSpin from '../components/LoadingSpin.vue';

export default {
    components: {
        LoadingSpin,
    },
    props: {
        text: String,
        loading: { type: Boolean, default: false },
        title: String,
        tipo: { type: [String, Number], default: 1 },
    },
};
</script>
