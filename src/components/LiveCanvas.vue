<template>
  <div class="board-wrapper">
    <div ref="selector" class="selector" @mousedown="disableSelector" @wheel="disableSelector"></div>
    <div ref="board" class="board">
      <canvas ref="canvas" @mouseup="getMousePos" @mousedown="disableSelector" @wheel="disableSelector"></canvas>
    </div>
    <div ref="colorButton" class="colorButton"  @mousedown="colorSelectedPixel"></div>
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
const colorButton = ref<HTMLElement>();
const fanZoom = ref<PanZoom.PanZoom>();

let selectedPixelX = 0
let selectedPixelY = 0

//Mock data
/*
const enis = Uint8Array.from("2552255225525555");
const smiley = Uint8Array.from("7007000070070770");
const karo = Uint8Array.from("1313313113133131");
const ring = Uint8Array.from("4444455445544444");
 */

function loadBoard(/*data: Uint8Array*/) {
  if (!canvas.value) return;

  let ctx = canvas.value.getContext("2d") as CanvasRenderingContext2D;

  for (let i = 0; i < store.state.canvas.width; i++) {
    for (let j = 0; j < store.state.canvas.height; j++) {
      ctx.fillStyle = store.state.canvas.colors[getRandomInt(5)/*getColor(i + 1, j, karo)*/].toString();
      ctx.fillRect(i, j, 1, 1);
    }
  }

}

function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}

function selectPixel(x: number, y: number, scale: number) {
  if (!selector.value) return;
  selector.value.style.left = x + "px";
  selector.value.style.top = y + "px";
  selector.value.style.width = scale + "px"
  selector.value.style.height = scale + "px";
}

function setSelectedPixel(x:number, y:number) {
  selectedPixelX = x;
  selectedPixelY = y;
}

onMounted(() => {
  if (!board.value) return;

  fanZoom.value = panzoom(board.value, {smoothScroll: false}).zoomTo(-250 , -50, 3)
  loadBoard();
})

const getColor = (x: number, y: number, arr: Uint8Array) => {
  return arr[y * 4 + x - 1];
}

const disableSelector = () => {
  selector.value?.classList.add("hidden")
}

const enableSelector = () => {
  selector.value?.classList.remove("hidden")
}

const colorSelectedPixel = () => {
  if (!canvas.value) return;
  let ctx = canvas.value.getContext("2d") as CanvasRenderingContext2D;

  console.log("color")

  ctx.fillStyle = store.getters.selectedColor.toString();
  ctx.fillRect(selectedPixelX, selectedPixelY, 1, 1);
}

const getMousePos = (evt) => {
  if (!canvas.value)
    return
  const rect = canvas.value.getBoundingClientRect();
  let x = Math.floor(((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.value.width)
  let y = Math.floor(((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.value.height)
  setSelectedPixel(x, y)
  console.log("x:", x, ", y:", y);

  let transform = fanZoom.value.getTransform();
  let scale = transform.scale;
  let transformedX = transform.x + x * scale;
  let transformedY = transform.y + y * scale;
  selectPixel(transformedX, transformedY, scale)
  enableSelector()
};

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
  background-color: rgba(1,1,1,0.5);
  z-index: 100;
}

.colorButton {
  position: absolute;
  top: 800px;
  left: 125px;

  width: 50px;
  height: 50px;;
  background-color: rgba(1,0,0,1);
  z-index: 200;
}

.hidden {
  opacity: 0;
}

canvas {
  z-index: 100;
  background-color: #fff;
  image-rendering: optimizeSpeed; /* Older versions of FF          */
  image-rendering: -moz-crisp-edges; /* FF 6.0+                       */
  image-rendering: -o-crisp-edges; /* OS X & Windows Opera (12.02+) */
  image-rendering: pixelated; /* Awesome future-browsers       */
  -ms-interpolation-mode: nearest-neighbor; /* IE                            */
}
</style>