<template>
  <div class="board-wrapper">
    <div ref="selector" class="selector"></div>
    <div ref="board" class="board">
        <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {StoreData} from "@/types";
import {onMounted, ref} from "vue";
import {Store, useStore} from "vuex";
import panzoom from "panzoom";

const store: Store<StoreData> = useStore();
const canvas = ref<HTMLCanvasElement>();
const board = ref<HTMLElement>();
const selector = ref<HTMLElement>();

//Mock data
const enis = Uint8Array.from("2552255225525555");
const smiley = Uint8Array.from("7007000070070770");
const karo = Uint8Array.from("1313313113133131");
const ring = Uint8Array.from("4444455445544444");

function loadBoard(data: Uint8Array) {
    if (!canvas.value) return;
    
    let ctx = canvas.value.getContext("2d") as CanvasRenderingContext2D;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ctx.fillStyle = store.state.canvas.colors[getColor(i+1, j, data)].toString();
            ctx.fillRect(i, j, 1, 1);
        }
    }

}

function selectPixel(x:number, y:number) {
    if(!selector.value) return;
    selector.value.style.left = x + "px";
    selector.value.style.top = y + "px";
}

onMounted(() => {
    if (!board.value) return;

    panzoom(board.value);
    loadBoard(karo);


    selectPixel(200, 150);
})

const getColor = (x: number, y: number, arr: Uint8Array) => {
  return arr[y * 4 + x - 1];
}
</script>

<style scoped>

.board-wrapper {
    height: 100%;
    width: 100%;
    background-color: lightgray;
    overflow: hidden;
    
    position: relative;
}

.selector {
    
    position: absolute;
    top: 100px;
    left: 125px;

    width: 50px;
    height: 50px;;
    background-color: red;
    z-index: 100;
}

canvas {
    z-index: 100;
    background-color: #fff;
    image-rendering: optimizeSpeed;             /* Older versions of FF          */
    image-rendering: -moz-crisp-edges;          /* FF 6.0+                       */
    image-rendering: -o-crisp-edges;            /* OS X & Windows Opera (12.02+) */
    image-rendering: pixelated;                 /* Awesome future-browsers       */
    -ms-interpolation-mode: nearest-neighbor;   /* IE                            */
}
</style>