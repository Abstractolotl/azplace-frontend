<template>
    <div>
        <panZoom>
            <img src="https://picsum.photos/300">
        </panZoom>
    </div>
</template>

<script setup lang="ts">
import type { StoreData } from "@/types";
import { onMounted } from "vue";
import { useStore, Store } from "vuex";

const store: Store<StoreData> = useStore();

let board;
let canvasWidth: number = store.getters.canvasWidth;
let canvasHeight: number = store.getters.canvasHeight;

let zoomLevel: number = 1;
let zoomMax: number = 50;
let zoomMultiplier: number = -0.01;

onMounted(() => {
  board = document.getElementById('board') as HTMLDivElement;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  if (!ctx) return;

  ctx.moveTo(0, 0);
  ctx.fillRect(100, 200, 128, 128);
})

const handleZoom = (event: any) => {
  board = document.getElementById('board') as HTMLDivElement;

  zoomLevel += event.deltaY * zoomMultiplier;
  zoomLevel = Math.min(Math.max(1, zoomLevel), zoomMax);

  board.style.transform = `scale(${zoomLevel}, ${zoomLevel})`;
}
</script>

<style scoped>
#canvas {
  background-color: #fff;
}
</style>