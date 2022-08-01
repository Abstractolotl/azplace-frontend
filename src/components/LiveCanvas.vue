<template>
  <div class="board-wrapper" @wheel="onMouseWheel" @mousedown="onMouseDown">
    <div ref="selector" class="selector"></div>
    <div ref="board" class="board" @mouseup="onMouseUp">
      <canvas v-if="store.state.canvasInfo.width != 0" ref="htmlCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">

import type {Board, StoreData} from "@/types";
import {onMounted, ref, watch} from "vue";
import {Store, useStore} from "vuex";
import panzoom, {type PanZoom} from "panzoom";

const store: Store<StoreData> = useStore();
const htmlCanvas = ref<HTMLCanvasElement>();
const board = ref<HTMLElement>();
const selector = ref<HTMLElement>();
const colorButton = ref<HTMLElement>();
const fanZoom = ref<PanZoom>();

onMounted(() => {
	if (!board.value || !htmlCanvas.value) return; //TODO

	fanZoom.value = panzoom(board.value, {smoothScroll: false})
	fanZoom.value.moveTo(htmlCanvas.value.width, htmlCanvas.value.height);

  loadMockData();
	disableSelector();
})

watch(store.state, () => {
  //TODO refactor
	if(!selector.value || !store.state.canvas) return;
	selector.value.style.backgroundColor = store.state.canvas.colors[store.state.selectedColorIndex].toString();
})

function loadBoard(board: Board) {
	if (!htmlCanvas.value || !htmlCanvas.value || !store.state.canvas) return; //TODO

    htmlCanvas.value.width = store.state.canvas.width;
    htmlCanvas.value.height = store.state.canvas.height;

	let ctx = htmlCanvas.value.getContext("2d") as CanvasRenderingContext2D;
	for (let i = 0; i < board.width; i++) {
		for (let j = 0; j < board.height; j++) {
			const index = getColorFromData(i, j, board.width, board.height, board.initialData);
			ctx.fillStyle = store.state.canvasInfo.colors[/*index*/ createNoise()].toString();
			ctx.fillRect(i, j, 1, 1);
		}
	}
}

function createNoise() {
  return Math.floor(Math.random() * 5);
}

function selectPixel(x: number, y: number) {
  	if (!selector.value || !fanZoom.value) return; //TODO
	if(x < 0 || y < 0 || x >= store.state.canvasInfo.width || y >= store.state.canvasInfo.height) return {x: -1, y: -1}; //TODO


    let transform = fanZoom.value.getTransform();
    let scale = transform.scale;
    let transformedX = transform.x + x * scale;
    let transformedY = transform.y + y * scale;

	selector.value.style.left = transformedX + "px";
	selector.value.style.top = transformedY + "px";
	selector.value.style.width = scale + "px"
	selector.value.style.height = scale + "px";
	enableSelector();
}

function loadMockData() {
	setTimeout(() => {
	store.state.canvas = {
		width: store.state.canvasInfo.width,
		height: store.state.canvasInfo.height,
		colors: store.state.canvasInfo.colors,
		initialData: Uint8Array.from([1,3,1,3,3,1,3,1,1,3,1,3,3,1,3,1])
	}

	loadBoard(store.state.canvas);
  }, 1000)
}

const getColorFromData = (x: number, y: number, width: number, height: number, data: Uint8Array) => {
  return data[y * width + x];
}

function disableSelector() {
  	selector.value?.classList.add("hidden")
	store.state.selecting = false;

	hideColorPalette();
}

function enableSelector() {
  	selector.value?.classList.remove("hidden")
	store.state.selecting = true;

	showColorPalette();
}

function colorSelectedPixel () {
  if (!htmlCanvas.value) return;
  let ctx = htmlCanvas.value.getContext("2d") as CanvasRenderingContext2D;

  console.log("color")
}

function showColorPalette() {
    document.dispatchEvent(new CustomEvent("navigate", {detail: {page: "palette", width: 250, forceOpen: true}}))
}

function hideColorPalette() {
}

const mouseDownPos = ref({x: 0, y: 0})

function onMouseDown(e: MouseEvent) {
	mouseDownPos.value = {x: e.x, y: e.y};
	disableSelector();
}

function onMouseUp(e: MouseEvent) {
	const distToMouseDown  = Math.sqrt( (e.x - mouseDownPos.value.x) * (e.x - mouseDownPos.value.x) + (e.y - mouseDownPos.value.y) * (e.y - mouseDownPos.value.y) )
	if(distToMouseDown < 50) {
		const pos = getBoardCoordsFromMousePos(e.x, e.y);
		if(!pos) return;
		selectPixel(pos.x, pos.y)
	} else {
		document.dispatchEvent(new CustomEvent("navigate", {detail: {page: "", width: 250, forceClose: false}}))
	}
}

function onMouseWheel() {
	console.log(123);
	disableSelector();
}

function getBoardCoordsFromMousePos(x:number, y:number) {
	if(!htmlCanvas.value) return ; //TODO

    const rect = htmlCanvas.value.getBoundingClientRect();
    let boardX = Math.floor(((x - rect.left) / (rect.right - rect.left)) * htmlCanvas.value.width)
    let boardY = Math.floor(((y - rect.top) / (rect.bottom - rect.top)) * htmlCanvas.value.height)
	return {x: boardX, y: boardY}
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
  z-index: 10;

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