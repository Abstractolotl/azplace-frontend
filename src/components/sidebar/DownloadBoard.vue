<template>
    <div class="download" @click="downloadImage">
      <span class="downloadText"> Download Canvas </span>
    </div>
  <br>
</template>

<script lang="ts" setup>

function downloadImage() {
  var link = document.createElement('a')
  //@ts-ignore
  link.href = document.querySelector("canvas").toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
  link.download = 'azplace-board.png'
  link.click()
}

</script>

<style scoped lang="scss">
@use "@/variables.scss" as *;

$panel-height: 50px;
$icon-height: 25px;
$profile-size: 40px;

.download {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  position: relative;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);

    > img:last-of-type {
      opacity: 1;
    }
  }
}

.downloadText {
  color: darkgray;
}

</style>