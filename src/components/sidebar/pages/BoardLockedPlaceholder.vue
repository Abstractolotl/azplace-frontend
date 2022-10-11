<template>
    <div class="board-locked" ref="locked">
        <template v-if="!store.state.board?.started">
            <span>Board not yet started</span>
            <span>{{ countdown }}</span>
        </template>
        <template v-if="store.state.board?.ended">
            <span>Board ended</span>
        </template>
    </div>
</template>

<script lang="ts" setup>
import type { StoreData } from '@/types';
import createPanZoom from 'panzoom';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore<StoreData>();
const locked = ref<HTMLDivElement>();

const countdown = ref<string>("");

onMounted(() => {
    if(!locked.value || !store.state.board) return;

    locked.value.style.width = store.state.board.width + "px";
    locked.value.style.height = store.state.board.height + "px";

    const fanZoom = createPanZoom(locked.value, {
        smoothScroll: false,
        initialZoom: 5,
        zoomDoubleClickSpeed: 1
    });

    fanZoom.moveTo(
        window.innerWidth * 0.5 - locked.value.clientWidth * fanZoom.getTransform().scale * 0.5,
        window.innerHeight * 0.5 - locked.value.clientHeight * fanZoom.getTransform().scale * 0.5
    )
    updateCountdown();
    setInterval(updateCountdown, 1000);
})


function updateCountdown() {
    if (!store.state.board || store.state.board.started) return;

    const millis = store.state.board.startDate - Date.now();
    const remaining = new Date(millis).toISOString();

    const days = Number.parseInt(remaining.substring(8, 10)) - 1;
    const time = remaining.substring(11, 19);

    countdown.value = days + ":" + time;
}
</script>

<style lang="scss">
.board-locked {
    position: absolute;
    background-color: darkgray;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 50;

    font-size: 4px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50px;
}
</style>