<template>
    <div class="error-container">
        <Error
            v-for="err in store.state.errors" 
            :message="err.message" 
            :time="err.time" 
        />
    </div>
</template>


<script lang="ts" setup>
import type { StoreData } from '@/types.js';
import { useStore } from 'vuex';
import Error from './Error.vue';

const store = useStore<StoreData>();
</script>

<style lang="scss" scoped>

.error-container {
    display: flex;
    flex-direction: column-reverse;
    pointer-events: none;

    $width: 250px;
    position: absolute;
    left: calc(50% - $width * 0.5);
    bottom: 0;
    width: $width;
    gap: 15px;
    padding-bottom: 25px;
}

</style>