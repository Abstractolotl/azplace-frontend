<template>
  <div class="error-banner">
    <span>Unfortunately there may be problems with our backend at the moment, we are already working on a solution.</span>
  </div>
</template>

<script>
export default {
  name: "ErrorBanner"

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