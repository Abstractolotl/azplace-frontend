<script setup lang="ts">
import { RouterView } from 'vue-router'
import axios from 'axios';
import config from './config.json';
import {useStore} from "vuex";

const store = useStore();

axios.get(config.API_BASE_URL + `/board/7/info`)
  .then((res) => {
    store.state.canvas.width = res.data.width;
    store.state.canvas.height = res.data.height;
    store.state.canvas.colors = res.data.colorPalette.hexColors;
  }).catch((err) => {
    console.log(err)
  })
</script>

<template>
  <RouterView />
</template>
