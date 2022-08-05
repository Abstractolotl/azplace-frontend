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
    if(props.colorIndex < 0 && props.colorIndex >= 16) {
        store.dispatch("pushError", { message: "UI: Internal Error (100)"})
        return;
    }

    const canvas = store.state.canvas;
    if( !canvas  || !canvas.colors  || canvas.colors.length <= props.colorIndex || !colorTile.value) {
        store.dispatch("pushError", { message: "UI: Internal Error (101)"})
        return;
    }

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
        outline: 3px solid white;
    }
}


.color-tile {
    position: absolute;
    left: 2px;
    right: 2px;
    top: 2px;
    bottom: 2px;
    border: 0.5px solid black;
    outline: 0.5px solid white;
}

</style>