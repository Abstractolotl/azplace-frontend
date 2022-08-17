<template>
    <div ref="selector" class="selector">
        <div :style="'background-color: ' + store.state.board?.colors[store.state.selectedColorIndex]"></div>
    </div>
</template>

<script lang="ts" setup>
import type { StoreData } from '@/types';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const selector = ref<HTMLElement>();
const selectorBg = ref<HTMLElement>();

const store = useStore<StoreData>();

onMounted(() => {
    if(!selector.value || !store.state.selectedPixel) return;

    selector.value.style.left = store.state.selectedPixel.transform.x + "px";
    selector.value.style.top = store.state.selectedPixel.transform.y + "px";
    selector.value.style.width = store.state.selectedPixel.transform.pixelSize + "px"
    selector.value.style.height = store.state.selectedPixel.transform.pixelSize + "px";
})
</script>

<style lang="scss">


.selector {
    position: absolute;
    top: 100px;
    left: 125px;

    width: 50px;
    height: 50px;
    ;
    z-index: 10;

    outline: 5px solid white;
    border: 0.5px solid black;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.25);

    $corner-size: 25%;

    >div {
        width: calc(100% + 0px);
        height: calc(100% + 0px);
        clip-path: polygon(0% 0%,
                100% 0%,
                100% (100% - $corner-size),
                (100% - $corner-size) 100%,
                0% 100%,
            );
    }

}
</style>