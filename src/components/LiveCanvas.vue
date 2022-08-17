// @ts-nocheck
<template>
    <div
        ref="boardWrapper"
        class="board-wrapper"
    >
        <div ref="selector" class="selector">
            <div ref="selectorBg"></div>
        </div>
        <PixelDialog 
            v-if="store.getters.isSelecting"
            @confirm="onConfirm"
            @cancel="onCancel"
            v-bind="selectedPixelAbsolutePos"
        />
        <div
            ref="board"
            class="board"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp"
        >
        <template v-if="store.state.canvas">
            <div v-if="!store.state.canvas.started" class="lock" ref="divCountdown">
                <span>Board not yet started</span>
                <span>{{countdown}}</span>
            </div>
            <canvas ref="htmlCanvas"></canvas>
        </template>
        <div v-else class="loading">
            <span>Loading Board</span> 
            <div class="loader"></div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import type {Board, CanvasData, StoreData} from "@/types";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {Store, useStore} from "vuex";
import panzoom, {type PanZoom} from "panzoom";
import AzPlaceAPI from "@/api.js";
import PixelDialog from "./PixelDialog.vue";

const store: Store<StoreData> = useStore();
const htmlCanvas = ref<HTMLCanvasElement>();
const board = ref<HTMLElement>();
const selector = ref<HTMLElement>();
const selectorBg = ref<HTMLElement>();
const boardWrapper = ref<HTMLElement>();
const fanZoom = ref<PanZoom>();
const mouseDownPos = ref({x: 0, y: 0})
const countdown = ref<string>("");
const divCountdown = ref<HTMLDivElement>();

const MIN_ZOOM_SELECT = 10;
const MIN_ZOOM = 5;
const MAX_ZOOM = 140;
const MAX_MOUSE_MOVE = 50; // distance the mouse can be moved while selecting a tile


onMounted(async () => {
    disableSelector();
    await AzPlaceAPI.loadBoard();
    AzPlaceAPI.setLiveUpdateHandler(handleLiveUpdate)
})

function handleLiveUpdate({x, y, color_index}: {x: number, y: number, color_index: number}) {
    if(!store.state.canvas) return;
    setPixel(x, y, store.state.canvas.colors[color_index].toString());
    store.state.cachedPixelOwner.delete(x + "|" + y);
}


let lastCanvas: any = null;
watch(store.state, () => {
  if(store.state.canvas && lastCanvas != store.state.canvas) {
    lastCanvas = store.state.canvas;
    nextTick().then(() => { 
        if(store.state.canvas) loadBoard(store.state.canvas) 
        if(divCountdown.value) divCountdown.value.style.width = store.state.canvas.width + "px";
    })
    updateCountdown();
    setInterval(updateCountdown, 1000)
  }
  //TODO refactor
  if (!selectorBg.value || !store.state.canvas) return;
  selectorBg.value.style.backgroundColor = store.state.canvas.colors[store.state.selectedColorIndex].toString();
  nextTick().then(initPanZoom);
  
})

function updateCountdown() {
    if(!store.state.canvas || store.state.canvas.started) return;

    const millis = store.state.canvas.startDate - Date.now();
    const remaining = new Date(millis).toISOString();

    const days = Number.parseInt(remaining.substring(8, 10)) - 1;
    const time = remaining.substring(11, 19);

    countdown.value = days + ":" + time;
}

function initPanZoom() {
    if (fanZoom.value) return;
    if (!board.value || !htmlCanvas.value || !boardWrapper.value) {
        store.dispatch("pushError", { message: "UI: Internal Error (302)"})
        return;
    }

    let zoomOptions = {
        smoothScroll: false,
        initialZoom: 3,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        zoomDoubleClickSpeed: 1
    };

    fanZoom.value = panzoom(board.value, zoomOptions);
    fanZoom.value.on("panstart", disableSelector);
    fanZoom.value.on("zoom", disableSelector);
    fanZoom.value.on("transform", disableSelector);

    fanZoom.value.moveTo(
        boardWrapper.value.clientWidth * 0.5 - htmlCanvas.value.clientWidth * fanZoom.value.getTransform().scale * 0.5,
        boardWrapper.value.clientHeight * 0.5 - htmlCanvas.value.clientHeight * fanZoom.value.getTransform().scale * 0.5
    )

  window.pants = fanZoom.value;
}

function loadBoard(board: Board) {
  if (!htmlCanvas.value || !htmlCanvas.value || !store.state.canvas) {
    store.dispatch("pushError", { message: "UI: Internal Error (301)"})
    return;
  }

  htmlCanvas.value.width = store.state.canvas.width;
  htmlCanvas.value.height = store.state.canvas.height;

  let ctx = htmlCanvas.value.getContext("2d") as CanvasRenderingContext2D;
  for (let i = 0; i < board.width; i++) {
    for (let j = 0; j < board.height; j++) {
      const index = getColorFromData(i, j, board.width, board.height, board.initialData);
      ctx.fillStyle = store.state.canvas.colors[index].toString();
      ctx.fillRect(i, j, 1, 1);
    }
  }
}

const selectedPixelAbsolutePos = computed(() => {
  if (!fanZoom.value || !store.state.selectedPixel) {
    store.dispatch("pushError", { message: "UI: Internal Error (300)"})
    return;
  }

  let transform = fanZoom.value.getTransform();
  let scale = transform.scale;
  let transformedX = transform.x + store.state.selectedPixel.x * scale;
  let transformedY = transform.y + store.state.selectedPixel.y * scale;
  return {
    x: transformedX,
    y: transformedY,
    pixelSize: scale
  };
});

function selectPixel(x: number, y: number) {
  if (!selector.value || !fanZoom.value || !store.state.canvas) {
    store.dispatch("pushError", { message: "UI: Internal Error (303)"})
    return;
  }
  if (x < 0 || y < 0 || x >= store.state.canvas.width || y >= store.state.canvas.height) return;


  let transform = fanZoom.value.getTransform();
  let scale = transform.scale;

  if (scale < MIN_ZOOM_SELECT) {
    zoomToPixel({x, y});
    return;
  }
  let transformedX = transform.x + x * scale;
  let transformedY = transform.y + y * scale;

  selector.value.style.left = transformedX + "px";
  selector.value.style.top = transformedY + "px";
  selector.value.style.width = scale + "px"
  selector.value.style.height = scale + "px";
  store.state.selectedPixel = {x, y};

  enableSelector();
}

function zoomToPixel(pos: {x: number, y: number}) {
    if(!fanZoom.value || !store.state.canvas || !boardWrapper.value || !htmlCanvas.value) {
    store.dispatch("pushError", { message: "UI: Internal Error (307)"})
    return;
  }


    fanZoom.value.zoomTo( 0, 0, MIN_ZOOM_SELECT / fanZoom.value.getTransform().scale )

    fanZoom.value.moveTo(
        boardWrapper.value.clientWidth * 0.5 - (pos.x) * fanZoom.value.getTransform().scale,
        boardWrapper.value.clientHeight * 0.5 - (pos.y) * fanZoom.value.getTransform().scale
    )
}

function onCancel() {
  disableSelector();
  hideColorPalette();
}

function onConfirm() {
  if (store.getters.isOnCooldown) return;

  if (!store.state.canvas || !store.state.selectedPixel) {
    store.dispatch("pushError", { message: "UI: Internal Error (304)"})
    return;
  }
  
  let x = store.state.selectedPixel.x;
  let y = store.state.selectedPixel.y;
  let color = store.state.canvas.colors[store.state.selectedColorIndex].toString();

  store.state.lastTimePlaced = Date.now(); // TODO: get from backend

  setPixel(x, y, color);
  AzPlaceAPI.doPlace();
  disableSelector();
  store.state.cachedPixelOwner.set(x+"|"+y, {
    username: store.state.user?.name,
    avatarURL: store.state.user?.avatarURL,
    timestamp: Date.now(),
    anonym: false
  })
}

const getColorFromData = (x: number, y: number, width: number, height: number, data: CanvasData) => {
  return data.pixels[y * width + x];
}

function disableSelector() {
  if (!selector.value) {
    store.dispatch("pushError", { message: "UI: Internal Error (305)"})
    return;
  }
  selector.value?.classList.add("hidden");
  store.state.selectedPixel = null;
}

function enableSelector() {
  selector.value?.classList.remove("hidden");

  if(store.state.user) showColorPalette();
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
  document.dispatchEvent(new CustomEvent("navigate", {detail: {page: "", width: 300, forceClose: false}}))
}


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
        hideColorPalette()
	}
}

function getBoardCoordsFromMousePos(x: number, y: number) {
  if (!htmlCanvas.value) {
    store.dispatch("pushError", { message: "UI: Internal Error (306)"})
    return;
  }

  const rect = htmlCanvas.value.getBoundingClientRect();
  let boardX = Math.floor(((x - rect.left) / (rect.right - rect.left)) * htmlCanvas.value.width)
  let boardY = Math.floor(((y - rect.top) / (rect.bottom - rect.top)) * htmlCanvas.value.height)
  return {x: boardX, y: boardY}
}

</script>

<style lang="scss" scoped>

.board-wrapper {
  height: 100%;
  width: 100%;
  background-color: lightgray;
  overflow: hidden;

  position: relative;
}

.loading {
    display: flex; 
    justify-content: center; 
    align-items: center; 
    flex-direction: column;
    gap: 20px;
    color: white;

    $width: 250px;
    $height: 150px;
    position: absolute;
    left: calc(50% - $width * 0.5);
    top: calc(50% - $height * 0.5);
    width: $width;
    height: $height;

    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.3);
}

.selector {
  position: absolute;
  top: 100px;
  left: 125px;

  width: 50px;
  height: 50px;;
  z-index: 10;

  outline: 5px solid white;
  border: 0.5px solid black;
box-sizing: border-box;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.25);

    $corner-size: 25%;
  > div {
    width: calc(100% + 0px);
    height: calc(100% + 0px);
    clip-path: polygon(
        0% 0%,
        100% 0%,
        100% (100% - $corner-size),
        (100% - $corner-size) 100%,
        0% 100%,
    );
  }

}

.hidden {
  display: none;
}

canvas {
  z-index: 100;
  background-color: #fff;
  image-rendering: optimizeSpeed; /* Older versions of FF          */
  image-rendering: -moz-crisp-edges; /* FF 6.0+                       */
  image-rendering: -o-crisp-edges; /* OS X & Windows Opera (12.02+) */
  image-rendering: pixelated; /* Awesome future-browsers       */
  -ms-interpolation-mode: nearest-neighbor; /* IE                            */

  .lock + & {
    filter: brightness(0.5);
  }
}

.lock {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 110;

    font-size: 4px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50px;
}

.loader {
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>