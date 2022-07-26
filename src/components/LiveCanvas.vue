<template>
  <div id="board-wrapper" @wheel="handleZoom($event)">
    <div id="board">
      <canvas id="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

let board;
let boardWrapper = document.getElementById('board-wrapper');
let canvasWidth: number = store.getters.canvasWidth;
let canvasHeight: number = store.getters.canvasHeight;

let zoomLevel = 1;

onMounted(() => {
  board = document.getElementById('board') as HTMLDivElement;
  const c = document.getElementById('canvas') as HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = c.getContext("2d");

  if (!ctx) return;

  ctx.moveTo(0, 0);
  ctx.fillRect(100, 200, 128, 128);
  ctx.stroke();
})

const handleZoom = (event: any) => {
  board = document.getElementById('board') as HTMLDivElement;

  zoomLevel += event.deltaY * -0.01;
  zoomLevel = Math.min(Math.max(.125, zoomLevel), 4);

  board.style.transform = `scale(${zoomLevel}, ${zoomLevel})`;
}

</script>

<style scoped>
#canvas {
  background-color: #fff;
}
</style>