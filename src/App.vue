<script setup lang="ts">
import { RouterView } from 'vue-router'
import axios from 'axios';
import config from './config.json';
import {useStore} from "vuex";

const store = useStore();

axios.get(config.API_BASE_URL + `/board/1/info`)
  .then((res) => {
    store.state.canvasInfo.id = res.data.id;
    store.state.canvasInfo.width = res.data.width;
    store.state.canvasInfo.height = res.data.height;
    store.state.canvasInfo.colors = res.data.colorPalette.hexColors;
    store.state.canvasInfo.cooldown = res.data.cooldown;
    console.log(res.data)
  }).catch((err) => {
    console.log(err)
  })


// axios.get("http://www.randomnumberapi.com/api/v1.0/random?min=1&max=500&count=1")
//   .then((res) => {
//     store.state.canvasInfo.width = res.data[0]
//     console.log(res.data[0])
//   })
//
// axios.get("http://www.randomnumberapi.com/api/v1.0/random?min=1&max=500&count=1")
//     .then((res) => {
//       store.state.canvasInfo.height = res.data[0]
//       console.log(res.data[0])
//     })


</script>

<template>
  <RouterView />
</template>
