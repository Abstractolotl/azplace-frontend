<script setup lang="ts">
import { RouterView } from 'vue-router'
import axios from 'axios';
import config from './config.json';
import {useStore} from "vuex";

const store = useStore();

// axios.get(config.API_BASE_URL + `/board/1/info`)
//   .then((res) => {
//     console.log(res.data);
//     store.state.canvas = {
//       id: res.data.id,
//       width: res.data.width,
//       height: res.data.height,
//       colors: res.data.color_palette.hex_colors,
//       cooldown: res.data.cooldown
//     };
//   }).catch((err) => {
//     console.log(err)
//   })


</script>

<template>
  <RouterView />
</template>
