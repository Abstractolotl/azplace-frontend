<template>
    <div class="color-outline" :class="{selected: store.state.selectedColorIndex == colorIndex}" @click="onColorClicked">
        <div ref="colorTile" class="color-tile"></div>
    </div>
</template>

<script lang="ts" setup>
import type { StoreData } from '@/types';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore<StoreData>();
const colorTile = ref<HTMLSpanElement>();
const selected = ref(false);

const props = defineProps({
    colorIndex: {
        type: Number,
        required: true
    },
})

function onColorClicked() {
    selected.value = true;
    store.state.selectedColorIndex = props.colorIndex;
}

function initColorFromStore() {
    if (!store.state.canvas) return;
    if(props.colorIndex < 0 && props.colorIndex >= 16) console.log("TODO: Error");

    const canvas = store.state.canvas;
    if( !canvas  || !canvas.colors  || canvas.colors.length <= props.colorIndex) console.log("TODO: Error");

    if(!colorTile.value) return;
    colorTile.value.style.backgroundColor = store.state.canvas.colors[props.colorIndex].toString();
}

onMounted(() => {
    initColorFromStore();
})

</script>

<style lang="scss">

.color-outline {
    position: relative;
    width: 50px;
    height: 50px;

    &.selected {
        background-color: white;
    }
}


.color-tile {
    position: absolute;
    left: 2px;
    right: 2px;
    top: 2px;
    bottom: 2px;
}

</style>