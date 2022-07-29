<script setup lang="ts">
import { RouterView } from 'vue-router'
import axios from 'axios';
import config from './config.json';
/*
axios.get(config.API_GET_BOARD_INFO)
  .then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err)
  })
  */
</script>

<template>
  <RouterView />
</template>
