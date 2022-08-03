<template>
  <div class="board-wrapper" @wheel="onMouseWheel" @mousedown="onMouseDown" @mouseup="onMouseUp">
    <div ref="selector" class="selector">
      <div class="buttonWrapper">
        <button class="hidden" ref="confirmationButton" type="button" onclick="console.log('test')">place</button>
      </div>
    </div>
    <div ref="board" class="board">
      <canvas v-if="store.state.canvasInfo.width != 0" ref="htmlCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">

import type {Board, StoreData} from "@/types";
import {onMounted, ref, watch} from "vue";
import {Store, useStore} from "vuex";
import panzoom, {type PanZoom} from "panzoom";
import axios from "axios";
import config from "@/config.json";

const store: Store<StoreData> = useStore();
const htmlCanvas = ref<HTMLCanvasElement>();
const board = ref<HTMLElement>();
const selector = ref<HTMLElement>();
const confirmationButton = ref<HTMLElement>();
const colorButton = ref<HTMLElement>();
const fanZoom = ref<PanZoom>();

const MIN_ZOOM_SELECT = 8;
const MIN_ZOOM = 3;
const MAX_ZOOM = 140;
const MAX_MOUSE_MOVE = 50; //distance the mouse can be moved while selecting a tile


onMounted(() => {
  if (!board.value || !htmlCanvas.value) return; //TODO

  let zoomOptions = {
    smoothScroll: false,
    initialZoom: 3,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    zoomDoubleClickSpeed: 1
  };

  fanZoom.value = panzoom(board.value, zoomOptions);
  fanZoom.value.moveTo(htmlCanvas.value.width, htmlCanvas.value.height);

  confirmationButton.value?.addEventListener("click", colorSelectedPixel);

  loadMockData();

  const socket = new WebSocket("ws://noucake.ddns.net:8080");
  socket.onmessage = handleWebSocketMessage;

  disableSelector();
})

watch(store.state, () => {
  //TODO refactor
  if (!selector.value || !store.state.canvas) return;
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
      ctx.fillStyle = store.state.canvasInfo.colors[/*index*/createNoise()].toString();
      ctx.fillRect(i, j, 1, 1);
    }
  }
}

function handleWebSocketMessage(event: MessageEvent) {
  let message = JSON.parse(event.data);
  if (!message.x || !message.y || !message.colorIndex) return;
  setPixel(message.x, message.y, store.state.canvasInfo.colors[message.colorIndex].toString());
  console.log(message.colorIndex);
}

function createNoise() {
  return Math.floor(Math.random() * 5);
}

function selectPixel(x: number, y: number) {
  if (!selector.value || !fanZoom.value || !store.state.canvas) return; //TODO
  if (x < 0 || y < 0 || x >= store.state.canvasInfo.width || y >= store.state.canvasInfo.height) return {x: -1, y: -1}; //TODO


  let transform = fanZoom.value.getTransform();
  let scale = transform.scale;
  if (scale < MIN_ZOOM_SELECT) return;
  console.log(scale);
  let transformedX = transform.x + x * scale;
  let transformedY = transform.y + y * scale;

  selector.value.style.left = transformedX + "px";
  selector.value.style.top = transformedY + "px";
  selector.value.style.width = scale + "px"
  selector.value.style.height = scale + "px";
  console.log('selected pixel ' + x + ', ' + y);
  store.state.selectedPixelX = x;
  store.state.selectedPixelY = y;

  enableSelector();
}

function loadMockData() {
  setTimeout(() => {
    store.state.canvas = {
      width: store.state.canvasInfo.width,
      height: store.state.canvasInfo.height,
      colors: store.state.canvasInfo.colors,
      initialData: Uint8Array.from([1, 3, 1, 3, 3, 1, 3, 1, 1, 3, 1, 3, 3, 1, 3, 1])
    }

    loadBoard(store.state.canvas);
  }, 1000)
}

const getColorFromData = (x: number, y: number, width: number, height: number, data: Uint8Array) => {
  return data[y * width + x];
}

function disableSelector() {
  if (!selector.value) return; //TODO
  selector.value?.classList.add("hidden")
  store.state.selecting = false;
  console.log("disableSelector");
  hideColorPalette();
}

function enableSelector() {
  selector.value?.classList.remove("hidden")
  confirmationButton.value?.classList.remove("hidden")
  console.log("enableSelector");
  store.state.selecting = true;

  showColorPalette();
}

function colorSelectedPixel() { // TODO: send pixel placement request
  if (isOnCooldown()) return
  let x = store.state.selectedPixelX;
  let y = store.state.selectedPixelY;
  let color = store.state.canvasInfo.colors[store.state.selectedColorIndex].toString();
  setPixel(x, y, color);
  let boardId = 1;

  sendPlacePixelRequest(x, y, color, boardId)

  store.state.lastTimePlaced = Date.now(); // TODO: get from backend
  confirmationButton.value?.setAttribute("disabled", "isDisabled");
  setCooldownTimeout();
  console.log("color x:", x, "y:", y);
}

function sendPlacePixelRequest(x: number, y: number, color: string, boardId: number) { // TODO: session missing
  let data = {
    x: x,
    y: y,
    color: color
  }
  axios.post(config.API_BASE_URL + `/board/${boardId}/place`, data).then(res => {
    console.log("placing pixel returned status code:", res.status);
    updateLastTimePlaced();
  }).catch(err => {
    console.log(err);
  });
}

function setCooldownTimeout() {
  let cooldown = store.state.canvasInfo.cooldown * 1000;
  setTimeout(() => {
    if (isOnCooldown()) return;
    confirmationButton.value?.removeAttribute("disabled");
  }, cooldown)
}

function isOnCooldown() {
  let cooldown = store.state.canvasInfo.cooldown * 1000;
  return store.state.lastTimePlaced + cooldown > Date.now();
}

function updateLastTimePlaced() { // TODO: implement with actual endpoint
  return;
  let boardId = 1;
  axios.get(config.API_BASE_URL + `board/${boardId}/whatever`).then(res => {
    store.state.lastTimePlaced = res.data.lastTimePlaced;
    setCooldownTimeout();
  }).catch(err => {
    console.log(err);
  });
}

function setPixel(x: number, y: number, color: string) {
  if (!htmlCanvas) return;
  if (!htmlCanvas.value) return;
  let ctx = htmlCanvas.value.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
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
	if(distToMouseDown < MAX_MOUSE_MOVE) {
		const pos = getBoardCoordsFromMousePos(e.x, e.y);
		if(!pos) return;
		selectPixel(pos.x, pos.y)
	} else {
		//TODO remove hard coded width
		document.dispatchEvent(new CustomEvent("navigate", {detail: {page: "", width: 250, forceClose: false}}))
	}
}

function onMouseWheel() {
	disableSelector();
}

function getBoardCoordsFromMousePos(x: number, y: number) {
  if (!htmlCanvas.value) return; //TODO

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
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.25);
}

.colorButton {
  position: absolute;
  top: 800px;
  left: 125px;

  width: 50px;
  height: 50px;;
  background-color: rgba(1, 0, 0, 1);
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