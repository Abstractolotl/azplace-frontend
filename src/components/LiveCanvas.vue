<template>
  <div class="board-wrapper">
    <div ref="selector" class="selector"></div>
    <div ref="board" class="board" @mousedown="onMouseDown" @mouseup="onMouseUp">
      <canvas ref="htmlCanvas"></canvas>
    </div>
    <div ref="colorButton" class="colorButton"></div>
  </div>
</template>

<script setup lang="ts">

import type {StoreData, Board} from "@/types";
import {onMounted, ref, watch} from "vue";
import {Store, useStore} from "vuex";
import panzoom, { type PanZoom } from "panzoom";

const store: Store<StoreData> = useStore();
const htmlCanvas = ref<HTMLCanvasElement>();
const board = ref<HTMLElement>();
const selector = ref<HTMLElement>();
const colorButton = ref<HTMLElement>();
const fanZoom = ref<PanZoom>();


onMounted(() => {
	if (!board.value || !store.state.canvas) return; //TODO

	fanZoom.value = panzoom(board.value, {smoothScroll: false})
	loadMockData();
	disableSelector();
})

watch(store.state, () => {
	if(!selector.value || !store.state.canvas) return;
	selector.value.style.backgroundColor = store.state.canvas.colors[store.state.selectedColorIndex].toString();
})

function loadBoard(width: number, height: number, board: Board) {
	if (!htmlCanvas.value) return; //TODO

	let ctx = htmlCanvas.value.getContext("2d") as CanvasRenderingContext2D;
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const index = getColorFromData(i, j, board.width, board.height, board.initialData);
			ctx.fillStyle = store.state.canvas.colors[index].toString();
			ctx.fillRect(i, j, 1, 1);
		}
	}	
}

function selectPixel(x: number, y: number, scale: number) {
  if (!selector.value) return;

  enableSelector();
  selector.value.style.left = x + "px";
  selector.value.style.top = y + "px";
  selector.value.style.width = scale + "px"
  selector.value.style.height = scale + "px";
}

function loadMockData() {
	setTimeout(() => {
	store.state.canvas = {
		width: 4,
		height: 4,
		colors: ["#ff0000", "#00ff00", "#0000ff", "#00ffff", "#ff00ff"],
		initialData: Uint8Array.from([1,3,1,3,3,1,3,1,1,3,1,3,3,1,3,1])
	}
  }, 1000)
}

const getColorFromData = (x: number, y: number, width: number, height: number, data: Uint8Array) => {
  return data[y * width + x];
}

function disableSelector() {
  	selector.value?.classList.add("hidden")
}

function enableSelector() {
  	selector.value?.classList.remove("hidden")
}

function colorSelectedPixel () {
  if (!htmlCanvas.value) return;
  let ctx = htmlCanvas.value.getContext("2d") as CanvasRenderingContext2D;

  console.log("color")
}

function showColorPalette() {
	store.state.sidebar.expanded = true;
	store.state.sidebar.panel = "palette";
}

function hideColorPalette() {
	if(store.state.sidebar.panel === "palette") {
		store.state.sidebar.expanded = false;
		store.state.sidebar.panel = "";
	}
}

const mouseDownPos = ref({x: 0, y: 0})

function onMouseDown(e: MouseEvent) {
	mouseDownPos.value = {x: e.x, y: e.y};
	disableSelector();
	console.log(fanZoom.value?.getTransform().scale)
}

function onMouseUp(e: MouseEvent) {

	const distToMouseDown  = Math.sqrt( (e.x - mouseDownPos.value.x) * (e.x - mouseDownPos.value.x) + (e.y - mouseDownPos.value.y) * (e.y - mouseDownPos.value.y) )
	if(distToMouseDown < 50) {

	}
}

function getBoardCoordsFromMousePos(x:number, y:number) {
	if(!htmlCanvas.value || x < 0 || y < 0 || x >= store.state.canvas.width || y >= store.state.canvas.height) return {x: -1, y: -1}; //TODO


    const rect = htmlCanvas.value.getBoundingClientRect();
    let boardX = Math.floor(((x - rect.left) / (rect.right - rect.left)) * htmlCanvas.value.width)
    let boardY = Math.floor(((y - rect.top) / (rect.bottom - rect.top)) * htmlCanvas.value.height)
	return {x: boardX, y: boardY}
}

const getMousePos = (evt: MouseEvent) => {
    if (!htmlCanvas.value || !fanZoom.value) return; //TODO


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
  z-index: 100;

  outline: 1px solid white;
  box-shadow: 0px 0px 10px 5px rgba(0,0,0, 0.25);
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