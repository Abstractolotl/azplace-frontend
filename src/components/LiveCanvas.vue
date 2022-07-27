<template>

  <div id="board-wrapper">
    <div id="board">
      <canvas id="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StoreData } from "@/types";
import { onMounted } from "vue";
import { useStore, Store } from "vuex";
import panzoom from "panzoom";

const store: Store<StoreData> = useStore();

let board;
let canvasWidth: number = store.getters.canvasWidth;
let canvasHeight: number = store.getters.canvasHeight;

onMounted(() => {
  board = document.getElementById('board') as HTMLDivElement;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  if (!ctx) return;

  ctx.moveTo(0, 0);
  ctx.fillRect(100, 200, 128, 128);

  panzoom(board);
})

</script>

<style scoped>
#canvas {
  background-color: #fff;
}
</style>