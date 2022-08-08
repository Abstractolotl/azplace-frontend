<template>
<div ref="dialogWrapper" class="dialogWrapper">

    <div v-if="!!owner" class="owner-box">
        <object :data="!owner.anonym ? owner.avatarURL : 'https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg'">
            <img src="https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg">
        </object>
        <div>
            <span> {{owner.username}} </span>
            <span> {{convertTimeStamp(owner.timestamp)}} ago</span>
        </div>
    </div>

    <div class="confirm-box">
        <button :disabled="isCooldown" type="button" @click="onConfirmation" >
            <img src="@/assets/done.svg">
        </button>
        <button type="button" @click="onCancel" >
            <img src="@/assets/close.svg">
        </button>
    </div>

    <div class="cooldown-box" v-if="isCooldown">
        <img src="@/assets/timer.svg">
        <div>
            <span> {{ cooldownText }} </span>
            <div class="loading-bar" :style="'width:' + loadingBarWidth "> </div>
        </div>
    </div>

</div>
</template>


<script lang="ts" setup>
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import {useStore} from "vuex";
import type {StoreData} from "@/types";
import { computed } from "@vue/reactivity";
import AzPlaceAPI from "@/api.js";

const store = useStore<StoreData>();
const dialogWrapper = ref<HTMLElement>();
const cooldownText = ref<string>("");
const isCooldown = ref<boolean>(false);
const owner = ref<any>();
const loadingBarWidth = ref<string>("0%");

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

onMounted(async () => {
    
    updateCooldown();
    nextTick().then(() => updateDialogPosition())
    intervalFunc = setInterval(() => {
        updateCooldown();
    }, 1000);

    if(!store.state.selectedPixel) return;
    const x = store.state.selectedPixel.x;
    const y = store.state.selectedPixel.y;
    const cacheKey = x+"|"+y;
    if(!store.state.cachedPixelOwner.has(cacheKey)) {
        const user = await AzPlaceAPI.requestPixel(x, y)
        store.state.cachedPixelOwner.set(cacheKey, user);
        owner.value = user;
    } else {
        owner.value = store.state.cachedPixelOwner.get(cacheKey);
    }
})

function convertTimeStamp(time: number) {
    const timestamp = Date.now() - time;
    if(timestamp < 60 * 1000) {
        return Math.floor(timestamp / 1000) + "s";
    } else if(timestamp < 60 * 60 * 1000) {
        return Math.floor(timestamp / (1000 * 60) ) + "m";
    } else if(timestamp < 24 * 60 * 60 * 1000) {
        return Math.floor(timestamp / (1000 * 60 * 60) ) + "h";
    } else {
        return "long";
    }
}

onUnmounted(() => {
    clearInterval(intervalFunc);
})

function onConfirmation() {
  emit("confirm");
  store.state.selectedPixel = null;
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

    loadingBarWidth.value = (cooldownLeft / store.state.canvas.cooldown) * 100 + "%";

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
    z-index: 101;
    background-color: white;
    width: 200px;
    border-radius: 3px;
    box-shadow: 5px 5px 10px 3px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;

    > .cooldown-box {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        color: #000000;
        filter: invert(26%) sepia(68%) saturate(7495%) hue-rotate(354deg) brightness(93%) contrast(124%);
        opacity: 0.666;
        padding: 3px;
        padding-top: 0;

         span {
            display: inline-block;
            text-align: right;
            padding-left: 5px;
        }

        > img {
        height: 20px;
        }

        .loading-bar {
            width: 100%;
            height: 5px;
            background-color: red;
            border-radius: 3px;
        }

        > :last-child {
            flex-grow: 1;
        }
    }

    .confirm-box {
        display: flex;
        align-items: center;

        button {
            color: white;
            text-align: center;
            outline: none;
            background-color: #00000000;
            border: 1px solid rgba(0, 0, 0, 0);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;

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

            > img {
                height: 25px;
            }

            &:first-of-type > img {
            filter: invert(27%) sepia(96%) saturate(2791%) hue-rotate(111deg) brightness(98%) contrast(104%);
            }

            &:last-of-type > img {
            filter: invert(26%) sepia(68%) saturate(7495%) hue-rotate(354deg) brightness(93%) contrast(124%);
            }
        }
    }

    .owner-box {
        display: flex;
        padding: 5px;
        gap: 5px;
        border-bottom: 1px solid lightgray;
        margin-bottom: 5px;

        img, object {
            height: 30px;
            width: 30px;
            border-radius: 30px;
        }

        div {
            display: flex;
            flex-direction: column;
        }

         span:nth-child(2){
            color: gray;
            font-size: 14px;
        }

    }
}
</style>
