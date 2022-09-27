<template>
    <h2>Board Info</h2>
    <p>
        The board is currently <b>{{ store.getters.active ? "active" : "inactive" }}</b>
        <br />
        You can place a pixel every <b>{{store.state.board?.cooldown}} seconds </b>
        Start Date: {{store.state.board?.startDate}}
        End Date: {{store.state.board?.endDate}}
    </p>
</template>

<script lang="ts" setup>
import type { StoreData } from '@/types';
import { useStore } from 'vuex';

const store = useStore<StoreData>();

</script>