<template>
    <div id="board">
        <canvas id="canvas" :width="canvasWidth" :height="canvasHeight" @mousemove="getMousePos($event)"></canvas>
    </div>
</template>

<script setup lang="ts">
//@ts-nocheck
import type {StoreData} from "@/types";
import {onMounted} from "vue";
import {Store, useStore} from "vuex";
import panzoom from "panzoom";

const enis = Uint8Array.from("2552255225525555");
const smiley = Uint8Array.from("7007000070070770");
const karo = Uint8Array.from("1313313113133131");
const ring = Uint8Array.from("4444455445544444");

const store: Store<StoreData> = useStore();

let board;
let canvas;
let canvasWidth: number = store.getters.canvasWidth;
let canvasHeight: number = store.getters.canvasHeight;

let colors = ["#FF0000", "#3333CC", "#00FF00", "#FFFF00", "#FF0066", "#FF9933", "#9900CC", "#00FFFF"]

onMounted(() => {
  board = document.getElementById('board') as HTMLDivElement;
  canvas = document.getElementById('canvas') as HTMLCanvasElement;
  let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  if (!ctx) return;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      ctx.fillStyle = colors[getColor(i + 1, j, karo)];
      ctx.fillRect(i, j, 1, 1);
    }
  }

  panzoom(board).zoomTo(-70, -30, 10);
})

const getColor = (x: number, y: number, arr: Uint8Array) => {
  return arr[y * 4 + x - 1];
}

const getMousePos = (evt) => {
  const rect = canvas.getBoundingClientRect();
  let x = Math.floor(((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width)
  let y = Math.floor(((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height)
  console.log("x:",x);
  console.log("y:",y);
  return {
    x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
  };
};

</script>

<style scoped>
#canvas {
  background-color: #fff;
  image-rendering: optimizeSpeed; /* Older versions of FF          */
  image-rendering: -moz-crisp-edges; /* FF 6.0+                       */
  image-rendering: -o-crisp-edges; /* OS X & Windows Opera (12.02+) */
  image-rendering: pixelated; /* Awesome future-browsers       */
  -ms-interpolation-mode: nearest-neighbor; /* IE                            */
  transform: scale(10, 10);
}
</style>