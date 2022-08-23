<template>
<div class="palette">
    <div @scroll="onScroll">
        <div :class="columnClass">
            <ColorTile v-for="(n, index) in numberOfTiles" :color-index="index" />
        </div>
        <div class="overlay bot top" ref="tileContainer">
            <div class="top"></div>
            <div class="bot"></div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import type { StoreData } from "@/types";
import { computed } from "@vue/reactivity";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import ColorTile from "./ColorTile.vue";

const store = useStore<StoreData>();
const numberOfTiles = ref<number>(0);
const tileContainer = ref<HTMLElement>();

onMounted(() => {
    if(!store.state.board) {
        return;
    }
    
    numberOfTiles.value = store.state.board.colors.length;
})

const columnClass = computed(() => {
    if(numberOfTiles.value < 8) {
        return;
    }

    if(numberOfTiles.value < 32) {
        return "two";
    }
    
    return "three";
})

function onScroll(e: Event) {
    const element = e.target as HTMLElement;
    if(!element || !tileContainer.value) return; //TODO

    const atTop = element.scrollTop < 25;
    const atBot = (element.scrollHeight - element.clientHeight) - element.scrollTop < 25;

    if (atTop) {
        tileContainer.value.classList.add("top");
    } else {
        tileContainer.value.classList.remove("top");
    }
    if (atBot) {
        tileContainer.value.classList.add("bot");
    } else {
        tileContainer.value.classList.remove("bot");
    }
    console.log(atTop, atBot)
}


</script>

<style lang="scss">
.palette {
    overflow: hidden;
    position: relative;
    display: flex;

    > div {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: 10px;
        padding: 10px;
        width: 100%;

        transition: 0.25s;
        overflow-y: auto;

        > div {
            display: grid;
            gap: 10px;
            padding: 5px;

            grid-template-columns: auto;

            &.two {
                grid-template-columns: auto auto;
            }

            &.three {
                grid-template-columns: auto auto auto;
            }
        }

        .overlay, .overlay > div {
            position: absolute;
            left: 0;
            right: 15px;
            top: 0;
            bottom: 0;
            pointer-events: none;

            transition: 0.25s;
            opacity: 1;

            &.top > .top {
                opacity: 0;
            }

            &.bot > .bot {
                opacity: 0;
            }
            > .top {
                background: linear-gradient(to bottom, #111 0%, transparent 15%);
            }
            > .bot {
                background: linear-gradient(to top, #111 0%, transparent 15%);
            }
        }
    }  
} 

</style>