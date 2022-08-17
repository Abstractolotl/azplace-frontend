<template>
    <Sidebar />
    <template v-if="store.state.board">
        <LiveBoard v-if="store.state.board.started"/>
        <BoardLockedPlaceholder v-else />
    </template>
    <BoardLoadingPlaceholder v-else />
    <ErrorOverlay />
</template>

<script setup lang="ts">
import Sidebar from "./components/sidebar/Sidebar.vue";
import LiveBoard from "./components/LiveBoard.vue";
import ErrorOverlay from "./components/error/ErrorOverlay.vue";
import { onMounted } from "vue";

import AzPlaceAPI from "@/api.js";
import { useStore } from "vuex";
import type { StoreData } from "./types";
import BoardLoadingPlaceholder from "./components/sidebar/BoardLoadingPlaceholder.vue";
import BoardLockedPlaceholder from "./components/sidebar/pages/BoardLockedPlaceholder.vue";

const store = useStore<StoreData>();

onMounted(() => {
    AzPlaceAPI.loadBoard().then(board => store.state.board = board)
    AzPlaceAPI.loadUser().then(user => store.state.user = user);
})
</script>

<style>

#app {
    background-color: lightgray;
}

</style>