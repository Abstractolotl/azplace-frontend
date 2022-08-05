<template>
    <div class="palette">
        <template v-if="numberOfTiles > 8">
            <div>
                <div v-for="(n, index) in Math.ceil(numberOfTiles / 2)">
                    <ColorTile :color-index="index" />
                </div>
            </div>
            <div>
                <div v-for="(n, index) in Math.floor(numberOfTiles / 2)">
                    <ColorTile :color-index="Math.ceil(numberOfTiles / 2) + index" />
                </div>
            </div>
        </template>
        <template v-else>
            <div>
                <div v-for="(color, index) in store.state.canvas?.colors">
                    <ColorTile :color-index="index" />
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import type { StoreData } from "@/types";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import ColorTile from "../ColorTile.vue";

const store = useStore<StoreData>();

const numberOfTiles = ref<number>(0);

onMounted(() => {
    if(!store.state.canvas) {
        return;
    }
    
    numberOfTiles.value = store.state.canvas.colors.length;
})



</script>

<style lang="scss">
.palette {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;

    transition: 0.25s;

    > div {
        
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;

        transition: 0.25s;
    }
}

</style>