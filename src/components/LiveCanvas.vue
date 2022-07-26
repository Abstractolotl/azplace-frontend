<template>
  <div id="board-wrapper" @wheel="handleZoom($event)">
    <div id="board">
      <canvas id="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore, Store } from "vuex";

const store: Store<any> = useStore();

let board;
let canvasWidth: number = store.getters.canvasWidth;
let canvasHeight: number = store.getters.canvasHeight;

let zoomLevel: number = 1;
let zoomMax: number = 50;

onMounted(() => {
  board = document.getElementById('board') as HTMLDivElement;
  const c = document.getElementById('canvas') as HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = c.getContext("2d");

  if (!ctx) return;

  ctx.moveTo(0, 0);
  ctx.fillRect(100, 200, 128, 128);
})

const handleZoom = (event: any) => {
  board = document.getElementById('board') as HTMLDivElement;

  zoomLevel += event.deltaY * -0.01;
  zoomLevel = Math.min(Math.max(1, zoomLevel), zoomMax);

  board.style.transform = `scale(${zoomLevel}, ${zoomLevel})`;
}
</script>

<style scoped>
#canvas {
  background-color: #fff;
}
</style>