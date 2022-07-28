<template>
    <div ref="sidebar" class="sidebar">
        <div class="expand-hint"><span :class="{hidden: navbarOpen}">></span></div>
        <div class="palette"  :class="{hidden: !navbarOpen}">
        <h2> Color Palette </h2>
            <div v-for="(color, index) in store.state.canvas.colors">
                <ColorTile :color-index="index" />
            </div>
        </div> 
    </div>
</template>

<script setup lang="ts">
import type { StoreData } from "@/types";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import ColorTile from "./ColorTile.vue";

const store = useStore<StoreData>();
const sidebar = ref<HTMLElement>();

let navbarOpen = ref(false);

onMounted(() => {
    closeNav();
    document.addEventListener("mousemove", e => {
        if(e.x <= 50 && !navbarOpen.value) openNav();
        if(e.x > 200 && navbarOpen.value) closeNav();
    })
})

const openNav = () => {
    if(!sidebar.value) return;
    sidebar.value.style.left = "0px";

    navbarOpen.value = true;
}

const closeNav = () => {
    if(!sidebar.value) return;
    sidebar.value.style.left = "-125px";

    navbarOpen.value = false;
}
</script>

<style scoped lang="scss">
.sidebar {
  height: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  transition: 0.5s;
  color: white;
  width: 150px;
}

.expand-hint {
    color: white;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 25px;
    padding-right: 10px;
    
    > * {
        opacity: 1;
        transition: 0.25s;
    }
}

.palette {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;

    transition: 0.25s;
}

.hidden {
    opacity: 0;
}
</style>