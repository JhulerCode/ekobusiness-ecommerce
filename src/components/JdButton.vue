<template>
    <div
        :title="title"
        :class="[
            'button',
            tipo == 1
                ? 'button1'
                : 'button2',
        ]"
    >
        <LoadingSpin scale="0.7" v-if="loading" />

        <slot name="iLeft"></slot>
        <span v-if="text">{{ text }}</span>
        <slot name="iRight"></slot>
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
