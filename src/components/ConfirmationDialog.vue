<template>
<div ref="dialogWrapper" class="dialogWrapper">

    <div class="cooldown-box" v-if="isCooldown">
        <img src="@/assets/timer.svg">
        <span> {{ cooldownText }} </span>
    </div>

    <div>
        <button :disabled="isCooldown" type="button" @click="onConfirmation" >
            <img src="@/assets/done.svg">
        </button>
        <button type="button" @click="onCancel" >
            <img src="@/assets/close.svg">
        </button>
    </div>

</div>
</template>


<script lang="ts" setup>
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import {useStore} from "vuex";
import type {StoreData} from "@/types";
import { computed } from "@vue/reactivity";

const store = useStore<StoreData>();
const dialogWrapper = ref<HTMLElement>();
const cooldownText = ref<string>("");
const isCooldown = ref<boolean>(false);

const emit = defineEmits(["confirm", "cancel"]);
const props = defineProps({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  pixelSize: {
    type: Number,
    required: true
  }
});

const DIALOG_PADDING = 15;

let intervalFunc: any;

onMounted(() => {
    updateCooldown();
    nextTick().then(() => updateDialogPosition())
    intervalFunc = setInterval(() => {
        updateCooldown();
    }, 1000);
})


onUnmounted(() => {
    clearInterval(intervalFunc);
})

function onConfirmation() {
  emit("confirm");
}

function onCancel() {
  emit("cancel");
  store.state.selectedPixel = null;
}

const updateCooldown = () => {
    if (!store.state.canvas) {
        store.dispatch("pushError", { message: "UI: Internal Error (200)"})
        return "";
    }

    const timeSincePlaced = Date.now() - store.state.lastTimePlaced;
    const cooldownLeft = Math.max(0, store.state.canvas.cooldown - timeSincePlaced);

    isCooldown.value = cooldownLeft > 0;
    
    const minutes = Math.floor(cooldownLeft / (60 * 1000));
    const seconds = Math.floor(cooldownLeft / 1000);

    cooldownText.value = minutes + ":" + (seconds < 10 ? "0": "") + seconds;
};

function updateDialogPosition() {
  if (!dialogWrapper.value) {
    store.dispatch("pushError", { message: "UI: Internal Error (202)"})
    return;
  }

  const {x, y, pixelSize} = props;

  const dialogWidth = dialogWrapper.value.getBoundingClientRect().width;
  const dialogHeight = dialogWrapper.value.getBoundingClientRect().height;
  const selectorCenterX = x + (pixelSize / 2);
  const selectorCenterY = y + (pixelSize / 2);
  const boardWidth = window.innerWidth;
  const boardHeight = window.innerHeight;


    let left = pixelSize * 0.5 + DIALOG_PADDING;
    dialogWrapper.value.style.transform = "translate(0, -50%)"

    if (x + pixelSize + dialogWidth + DIALOG_PADDING*2 >= boardWidth) {
        left *= -1;
        dialogWrapper.value.style.transform = "translate(-100%, -50%)"
    }
    dialogWrapper.value.style.left = selectorCenterX + left  + "px";
    dialogWrapper.value.style.top = selectorCenterY + "px";
/*
  // left right
  if (x + pixelSize + dialogWidth + DIALOG_PADDING*2 < boardWidth) {// left
    dialogWrapper.value.style.left = (x + pixelSize + DIALOG_PADDING) + "px";
  } else {                                                          // right
    dialogWrapper.value.style.left = (x - dialogWidth - DIALOG_PADDING) + "px";
  }

  // top bottom
  if (selectorCenterY - (dialogHeight / 2) < 0) {                   // top
    dialogWrapper.value.style.top = DIALOG_PADDING + "px";
  } else if (selectorCenterY + (dialogHeight / 2) > boardHeight) {  // bottom
    dialogWrapper.value.style.top = (boardHeight - dialogHeight - DIALOG_PADDING) + "px";
  } else {
    dialogWrapper.value.style.top = (selectorCenterY - (dialogHeight / 2)) + "px";   // default
  }
  */
}

</script>


<style lang="scss">

.dialogWrapper {
  position: absolute;
  left: 0px;
  width: 120px;
  z-index: 101;
  background-color: white;
  border-radius: 3px;
  box-shadow: 5px 5px 10px 3px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  gap: 5px;

  > .cooldown-box {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000000;
    filter: invert(26%) sepia(68%) saturate(7495%) hue-rotate(354deg) brightness(93%) contrast(124%);
    opacity: 0.666;

    > span {
      width: 50px;
      text-align: right;
    }

    > img {
      height: 20px;
    }
  }

  > :last-child {
    display: flex;
    justify-content: space-evenly;
    gap: 10px;
    align-items: center;
  }

  button {
    color: white;
    text-align: center;
    font-size: 25px;
    outline: none;
    background-color: #00000000;
    border: 1px solid rgba(0, 0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover:not([disabled]) {
      border: 1px solid rgba(0, 0, 0, 0.4);
      border-radius: 3px;
    }

    &:active:hover:not([disabled])  {
      background-color: lightgray;
    }

    &[disabled] {
      filter: grayscale(1);
    }

    &:first-of-type > img {
      filter: invert(27%) sepia(96%) saturate(2791%) hue-rotate(111deg) brightness(98%) contrast(104%);
    }

    &:last-of-type > img {
      filter: invert(26%) sepia(68%) saturate(7495%) hue-rotate(354deg) brightness(93%) contrast(124%);
    }

  }
}
</style>
