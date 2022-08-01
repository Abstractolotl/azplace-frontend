<script setup lang="ts">
import { RouterView } from 'vue-router'
import axios from 'axios';
import config from './config.json';
import {useStore} from "vuex";

const store = useStore();

/*
axios.get(config.API_BASE_URL + `/board/0/info`)
  .then((res) => {
    store.state.canvas.id = res.data.id;
    store.state.canvas.width = res.data.width;
    store.state.canvas.height = res.data.height;
    store.state.canvas.colors = res.data.colorPalette.hexColors;
  }).catch((err) => {
    console.log(err)
  })
*/


axios.get("http://www.randomnumberapi.com/api/v1.0/random?min=1&max=500&count=1")
  .then((res) => {
    store.state.canvasInfo.width = res.data[0]
    console.log(res.data[0])
  })

axios.get("http://www.randomnumberapi.com/api/v1.0/random?min=1&max=500&count=1")
    .then((res) => {
      store.state.canvasInfo.height = res.data[0]
      console.log(res.data[0])
    })


</script>

<template>
  <RouterView />
</template>
