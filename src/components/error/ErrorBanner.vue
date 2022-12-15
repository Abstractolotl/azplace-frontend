<template>
  <div v-if="isEnabled()" class="error-banner">
    <span>{{ getText() }}</span>
  </div>
</template>

<script type="ts" setup>
function isEnabled() {
  return import.meta.env.VITE_SHOW_ERROR_BANNER != undefined && import.meta.env.VITE_SHOW_ERROR_BANNER == 1;
}

function getText() {
  if(import.meta.env.VITE_ERROR_BANNER_TEXT == undefined){
    return "We are currently making changes there may be disconnections."
  } else {
    return import.meta.env.VITE_ERROR_BANNER_TEXT;
  }
}
</script>

<style lang="scss"  scoped>
.error-banner {
  padding: 10px;
  position: absolute;

  background-color: #ff231d;
  top: 0;

  text-align: center;

  $width: 950px;
  left: calc(50% - $width * 0.5);
  width: $width;

  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.error-banner span {
  font-size: 20px;
  font-weight: bold;
  color: white;
}
</style>