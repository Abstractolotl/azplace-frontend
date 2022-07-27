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
const store: Store<StoreData> = useStore();

import panzoom from "panzoom";

const arr = Uint8Array.from("1111511511115555");


let board;
let canvasWidth: number = store.getters.canvasWidth;
let canvasHeight: number = store.getters.canvasHeight;

let zoomLevel: number = 1;
let zoomMax: number = 150;
let zoomMultiplier: number = -0.01;

let colors = ["#FF0000", "#3333CC", "#00FF00", "#FFFF00", "#FF0066", "#FF9933", "#9900CC", "#00FFFF"]

onMounted(() => {
  board = document.getElementById('board') as HTMLDivElement;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  if (!ctx) return;

  ctx.fillRect(100, 200, 128, 128);

  console.log(arr[0])
  window.test = arr;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      //console.log(getColor(j+1,i))
      ctx.fillStyle = colors[getColor(j+1, i)];
      ctx.fillRect(i, j, 1, 1);
    }
  }
  //console.log(arr[3])

  var element = document.getElementById('board') as HTMLDivElement

  panzoom(element);

})

function getColor(x : number, y : number) {
  let color = arr[y * 4 + x -1]
  return  color
}

</script>

<style scoped>
#canvas {
  background-color: #fff;
}
</style>