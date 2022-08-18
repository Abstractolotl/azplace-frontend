<template>
    <div>
        <span> {{message}} </span>
    </div>
</template>

<script lang="ts" setup>
import { store } from '@/store.js';
import { onMounted } from 'vue';

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    }
})

onMounted(() => {
    setTimeout(() => {
        store.state.errors = store.state.errors.filter(e => e.time != props.time)
    }, 5000)
})

</script>

<style scoped>

div {
    border: 3px solid red;
    border-radius: 5px;
    padding: 5px;
    background-color: lightcoral;
    color: white;
    text-align: center;
    box-shadow: 5px 5px 5px 1px rgba(0, 0, 0, 0.5);

    animation: fadeout 5s;
    opacity: 0;
}

@keyframes fadeout {
    0% { opacity: 1; }    
    90% { opacity: 1; }
    100% { opacity: 0; }
}

</style>