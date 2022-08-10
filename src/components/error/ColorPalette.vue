<template>
    <div class="palette">
        <div :class="columnClass">
            <ColorTile v-for="(n, index) in numberOfTiles" :color-index="index%8" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { StoreData } from "@/types";
import { computed } from "@vue/reactivity";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import ColorTile from "../ColorTile.vue";

const store = useStore<StoreData>();

const numberOfTiles = ref<number>(0);

onMounted(() => {
    if(!store.state.canvas) {
        return;
    }
    
    numberOfTiles.value = 32;
})

const columnClass = computed(() => {
    if(numberOfTiles.value < 8) {
        return;
    }

    if(numberOfTiles.value < 32) {
        return "two";
    }
    
    return "three";
})


</script>

<style lang="scss">
.palette {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;

    transition: 0.25s;
    overflow-y: auto;

    > div {
        display: grid;
        gap: 10px;
        padding: 5px;

        grid-template-columns: auto;

        &.two {
            grid-template-columns: auto auto;
        }

        &.three {
            grid-template-columns: auto auto auto;
        }
    }
}

</style>