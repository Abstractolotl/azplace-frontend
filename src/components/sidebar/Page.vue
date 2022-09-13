<template>
    <div class="panel">
        <img class="arrow-back" src="@/assets/arrow_back.svg" @click="onBack" />
        <h1>  {{title}} </h1>
    </div>
    <slot />
</template>


<script lang="ts" setup>
import { onMounted } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    }
})

function onBack() {
    document.dispatchEvent(new CustomEvent("navigate", {detail: {page: "", width: 300}}))
}

</script>


<style lang="scss" scoped>

.panel {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 15px;
    padding-left: 30px;
    
    .arrow-back {
        filter: invert(1);
        height: 25px;
        position: absolute;
        left: 5px;
        cursor: pointer;
    }
}

</style>