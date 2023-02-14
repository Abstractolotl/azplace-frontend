<template>
    <div ref="boardWrapper" class="board-wrapper">
        <BanDialog v-if="store.state.banData"/>
        <template v-if="store.state.selectedPixel">
            <PixelDialog
                :locked="locked"
                @confirm="onConfirm"
                @cancel="onCancel" 
                @enter="() => fanZoom?.pause()"
                @leave="() => fanZoom?.resume()"
                v-bind="store.state.selectedPixel.transform" 
            />
            <Selector />
        </template>
        <div ref="board" class="board" @mousedown="onMouseDown" @mouseup="onMouseUp">

            <div style="text-align: left; color: red;">Board ended</div>
            <canvas v-if="store.state.board" ref="htmlCanvas"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">

import type { CanvasData, StoreData, User } from "@/types";
import { onMounted, ref } from "vue";
import { Store, useStore } from "vuex";
import panzoom, { type PanZoom } from "panzoom";
import AzPlaceAPI from "@/api";
import PixelDialog from "./PixelDialog.vue";
import Selector from "./Selector.vue";
import BanDialog from "@/components/BanDialog.vue";

const store: Store<StoreData> = useStore();
const htmlCanvas = ref<HTMLCanvasElement>();
const board = ref<HTMLElement>();
const boardWrapper = ref<HTMLElement>();
const fanZoom = ref<PanZoom>();
const mouseDownPos = ref({ x: 0, y: 0 })

const MIN_ZOOM_SELECT = 10;
const MIN_ZOOM = 4;
const MAX_ZOOM = 140;
const MAX_MOUSE_MOVE = 50; // distance the mouse can be moved while selecting a tile

defineProps({
    locked: Boolean
})

onMounted(async () => {
    clearSelection();
    loadBoard();
    initPanZoom();
    AzPlaceAPI.setLiveUpdateHandler(handleLiveUpdate);
})

function initPanZoom() {
    if (fanZoom.value) return;
    if (!board.value || !htmlCanvas.value || !boardWrapper.value) {
        store.dispatch("pushError", { message: "UI: Internal Error (302)" })
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
    fanZoom.value.on("panstart", clearSelection);
    fanZoom.value.on("zoom", clearSelection);

    let lastTransform = Object.assign({}, fanZoom.value.getTransform());
    fanZoom.value.on("transform", () => {
        if(!fanZoom.value) return;
        const transform = fanZoom.value.getTransform();
        if(lastTransform.x != transform.x && lastTransform.y != transform.y && lastTransform.scale != transform.scale) {
            lastTransform = Object.assign({}, fanZoom.value.getTransform());
            clearSelection();
        }
    })

    fanZoom.value.moveTo(
        boardWrapper.value.clientWidth * 0.5 - htmlCanvas.value.clientWidth * fanZoom.value.getTransform().scale * 0.5,
        boardWrapper.value.clientHeight * 0.5 - htmlCanvas.value.clientHeight * fanZoom.value.getTransform().scale * 0.5
    )
}

function loadBoard() {
    if (!htmlCanvas.value || !htmlCanvas.value || !store.state.board) {
        store.dispatch("pushError", { message: "UI: Internal Error (301)" })
        return;
    }

    const board = store.state.board;

    htmlCanvas.value.width = store.state.board.width;
    htmlCanvas.value.height = store.state.board.height;

    let ctx = htmlCanvas.value.getContext("2d") as CanvasRenderingContext2D;
    for (let i = 0; i < board.width; i++) {
        for (let j = 0; j < board.height; j++) {
            const index = getColorFromData(i, j, board.width, board.height, board.initialData);
            ctx.fillStyle = store.state.board.colors[index].toString();
            ctx.fillRect(i, j, 1, 1);
        }
    }
}

function handleLiveUpdate({ x, y, color_index }: { x: number, y: number, color_index: number }) {
    if (!store.state.board) return;
    setColorOfPixel(x, y, store.state.board.colors[color_index].toString());
    store.state.cachedPixelOwner.delete(x + "|" + y);
}

function onMouseDown(e: MouseEvent) {
    mouseDownPos.value = { x: e.x, y: e.y };
    clearSelection();
}

function onMouseUp(e: MouseEvent) {
    const distToMouseDown = Math.sqrt((e.x - mouseDownPos.value.x) * (e.x - mouseDownPos.value.x) + (e.y - mouseDownPos.value.y) * (e.y - mouseDownPos.value.y))
    if (distToMouseDown < MAX_MOUSE_MOVE) {
        const pos = getBoardCoordsFromMousePos(e.x, e.y);
        if (!pos) return;
        selectPixel(pos.x, pos.y)
    } else {
        hideColorPalette()
    }
}

function onCancel() {
    clearSelection();
    hideColorPalette();
}

function onConfirm() {
    if (store.getters.isOnCooldown || !store.state.user) return;

    if (!store.state.board || !store.state.selectedPixel) {
        store.dispatch("pushError", { message: "UI: Internal Error (304)" })
        return;
    }

    let { x, y } = store.state.selectedPixel.coords;
    let color = store.state.board.colors[store.state.selectedColorIndex].toString();

    store.state.lastTimePlaced = Date.now(); // TODO: get from backend

    setColorOfPixel(x, y, color);
    AzPlaceAPI.doPlace(x, y, store.state.selectedColorIndex);
    clearSelection();
    hideColorPalette();
    cachePixelOwner(x, y, store.state.user);
}

function selectPixel(x: number, y: number) {
    if (!fanZoom.value || !store.state.board) {
        store.dispatch("pushError", { message: "UI: Internal Error (303)" })
        return;
    }

    if (x < 0 || y < 0 || x >= store.state.board.width ||
        y >= store.state.board.height) {
        return;
    }

    let transform = fanZoom.value.getTransform();
    let scale = transform.scale;

    if (scale < MIN_ZOOM_SELECT) {
        zoomToPixel({ x, y });
        return;
    }
    let transformedX = transform.x + x * scale;
    let transformedY = transform.y + y * scale;

    store.state.selectedPixel = {
        coords: { x, y },
        transform: {
            x: transformedX,
            y: transformedY,
            pixelSize: scale
        }
    };

    showColorPalette();
}

function zoomToPixel(pos: { x: number, y: number }) {
    if (!fanZoom.value || !store.state.board || !boardWrapper.value || !htmlCanvas.value) {
        store.dispatch("pushError", { message: "UI: Internal Error (307)" })
        return;
    }

    fanZoom.value.zoomTo(0, 0, MIN_ZOOM_SELECT / fanZoom.value.getTransform().scale)

    fanZoom.value.moveTo(
        boardWrapper.value.clientWidth * 0.5 - (pos.x) * fanZoom.value.getTransform().scale,
        boardWrapper.value.clientHeight * 0.5 - (pos.y) * fanZoom.value.getTransform().scale
    )
}

function cachePixelOwner(x: number, y: number, user: User) {
    const cacheKey = x + "|" + y;
    store.state.cachedPixelOwner.set(cacheKey, {
        username: user.name,
        avatarURL: user.avatarURL,
        timestamp: Date.now(),
        anonym: false
    })
}

const getColorFromData = (x: number, y: number, width: number, height: number, data: CanvasData) => {
    return data.pixels[y * width + x];
}

function clearSelection() {
    store.state.selectedPixel = null;
}

function setColorOfPixel(x: number, y: number, color: string) {
    if (!htmlCanvas) return;
    if (!htmlCanvas.value) return;
    let ctx = htmlCanvas.value.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

function getBoardCoordsFromMousePos(x: number, y: number) {
    if (!htmlCanvas.value) {
        store.dispatch("pushError", { message: "UI: Internal Error (306)" })
        return;
    }

    const rect = htmlCanvas.value.getBoundingClientRect();
    let boardX = Math.floor(((x - rect.left) / (rect.right - rect.left)) * htmlCanvas.value.width)
    let boardY = Math.floor(((y - rect.top) / (rect.bottom - rect.top)) * htmlCanvas.value.height)
    return { x: boardX, y: boardY }
}

function showColorPalette() {
    document.dispatchEvent(new CustomEvent("navigate", { detail: { page: "palette", width: 250, forceOpen: true } }))
}

function hideColorPalette() {
    document.dispatchEvent(new CustomEvent("navigate", { detail: { page: "", width: 300, forceClose: false } }))
}

</script>

<style lang="scss" scoped>
.board-wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;

    position: relative;
}

canvas {
    z-index: 100;
    background-color: #fff;
    image-rendering: optimizeSpeed;
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: pixelated;
    -ms-interpolation-mode: nearest-neighbor;
}
</style>