<template>
  <div id="mySidebar" class="sidebar">
    <a href="javascript:void(0)" class="closebtn" @click="closeNav()">×</a>
    <div class="color" v-for="color in mockColors" :style="`background-color: ${color};`">
      <span class="color-text">
        {{ color }}
      </span>
    </div>
  </div>

  <button id="openNav" @click="openNav()">></button>
</template>

<script setup lang="ts">
//@ts-nocheck
const openNav = () => {
  document.getElementById("mySidebar").style.width = "250px";
}

const closeNav = () => {
  document.getElementById("mySidebar").style.width = "0";
}

const mockColors: string[] = ["#fff", "#aaa", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

.sidebar {
  font-family: 'Open Sans', sans-serif;
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;

  a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    transition: 0.3s;

    &:hover {
      color: #f1f1f1;
    }
  }

  .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
  }
}

.openbtn {
  font-size: 20px;
  cursor: pointer;
  background-color: #111;
  color: white;
  padding: 10px 15px;
  border: none;

  &:hover {
    background-color: #444;
  }
}

#main {
  transition: margin-left .5s;
  padding: 16px;
}

@media screen and (max-height: 450px) {
  .sidebar {
    padding-top: 15px;

    a {
      font-size: 18px;
    }
  }
}

#openNav {
  line-height: 12px;
  width: 18px;
  font-size: 8pt;
  margin-top: 1px;
  margin-right: 2px;
  position: absolute;
  top: 0;
  left: 0;
}

.color {
  cursor: pointer;
  background-color: #fff;
  /* width: 40px; */
  height: 40px;
  margin: 15px;
  font-size: 25px;
  text-align: center;
}

.color-text {
  text-shadow: -2px -2px 0 white, 2px 2px 0 white, 2px -2px 0 white, -2px 2px 0 white;
  font-weight: bold;
}
</style>