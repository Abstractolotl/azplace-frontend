<template>
    <div class="board-info">
        <h2>Board Info</h2>
        <ul>
            <li>The board is currently <b>{{ store.getters.active ? "active" : "inactive" }}</b></li>
            <li>You can place a pixel every <b>{{store.state.board ? store.state.board.cooldown / 1000 : 0}} seconds </b></li>
            <li>Start Date: {{ new Date(store.state.board?.startDate).toLocaleString()}} </li>
            <li>End Date: {{ new Date(store.state.board?.endDate).toLocaleString() }}</li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import type { StoreData } from '@/types';
import { useStore } from 'vuex';

const store = useStore<StoreData>();

</script>

<style lang="scss">

.board-info {
    text-align: center;

    ul {
        list-style: none;
        gap: 10px;
        padding: 0 5px;
        text-align: left;

        li {
            line-height: 1.5em;
        }
    }
}

</style>