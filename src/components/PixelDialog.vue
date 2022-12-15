<template>
    <div ref="dialogWrapper" v-if="owner" class="dialogWrapper"
    @mouseenter="emit('enter')" @mouseleave="emit('leave')">

        <div v-if="wasPlaced(owner.username)" class="owner-box">
            <div class="img">
                <img src="@/assets/default-profile.jpg">
                <img v-if="owner.avatarURL" :src="owner.avatarURL">
            </div>
            <div>
                <span> {{ owner.username }} </span>
                <span class="timestamp" @click="timestampAsLocalDate = !timestampAsLocalDate">
                  {{ pixelTimestamp }}
                </span>
            </div>
        </div>

        <div v-if="store.state.user" class="confirm-box">
            <button :disabled="isCooldown" type="button" @click="onConfirmation">
                <img draggable="false" src="@/assets/done.svg">
            </button>
            <button type="button" @click="onCancel">
                <img draggable="false" src="@/assets/close.svg">
            </button>
        </div>
        <div class="login-reminder" v-else>
            You need to be logged in to place pixels
        </div>

        <div class="cooldown-box" v-if="isCooldown">
            <img src="@/assets/timer.svg">
            <div>
                <span> {{ cooldownText }} </span>
                <div class="loading-bar" :style="loadingDurationStyle"></div>
            </div>
        </div>

    </div>
</template>


<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import type { StoreData } from "@/types";
import AzPlaceAPI from "@/api";

const store = useStore<StoreData>();
const dialogWrapper = ref<HTMLElement>();
const cooldownText = ref<string>("");
const isCooldown = ref<boolean>(false);
const owner = ref<any>();
const loadingBarWidth = ref<string>("0%");
const timestampAsLocalDate = ref<boolean>(false);
const pixelTimestamp = ref<string>("");

const emit = defineEmits(["confirm", "cancel", "enter", "leave"]);

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
    if (!store.state.selectedPixel) return;
    const x = store.state.selectedPixel.coords.x;
    const y = store.state.selectedPixel.coords.y;

    const pixelOwner = await loadPixelOwner(x, y);
    owner.value = pixelOwner;

    updateCooldown();
    updatePixelTimestamp();
    nextTick().then(() => updateDialogPosition())
    intervalFunc = setInterval(() => {
        updateCooldown();
        updatePixelTimestamp();
    }, 500);
})

const loadingDurationStyle = computed(() => {
  if (!store.state.board) return "";
  return 'animation-duration: '+ Math.max(0, store.state.board.cooldown - (Date.now() - store.state.lastTimePlaced))/1000 + 's';
} )

function wasPlaced(owner: string) {
  return owner != 'unknown';
}

function updatePixelTimestamp() {
  pixelTimestamp.value = timestampAsLocalDate.value ? showTimeOfPixelPlacement(owner.value.timestamp) : convertTimeStamp(owner.value.timestamp) + " ago"
}

function convertTimeStamp(time: number) {
    const timestamp = Date.now() - time;
    if (timestamp < 60 * 1000) {
        return Math.floor(timestamp / 1000) + "s";
    } else if (timestamp < 60 * 60 * 1000) {
        return Math.floor(timestamp / (1000 * 60)) + "m";
    } else if (timestamp < 24 * 60 * 60 * 1000) {
        return Math.floor(timestamp / (1000 * 60 * 60)) + "h";
    } else if (timestamp < 7 * 24 * 60 * 60 * 1000) {
        return Math.floor(timestamp / (24 * 1000 * 60 * 60)) + "d";
    } else if (timestamp < 30 * 24 * 60 * 60 * 1000) {
        return Math.floor(timestamp / (7 * 24 * 1000 * 60 * 60)) + "weeks";
    } else if (timestamp < 6 * 30 * 24 * 60 * 60 * 1000) {
        return Math.floor(timestamp / (30 * 24 * 1000 * 60 * 60)) + "months";
    } else {
        return "long";
    }
}

function showTimeOfPixelPlacement(time: number) {
    const date = new Date(time)
    const localTime = date.toLocaleTimeString("de").substring(0, 5);
    const localDate = date.toLocaleDateString("de")
    return localDate.substring(0, localDate.length - 4) + localDate.substring(localDate.length - 2, localDate.length) + " " + localTime
}


async function requestAndCachePixelOwner(x: number, y: number) {
    const cacheKey = x + "|" + y;
    const pixelOwner = await AzPlaceAPI.requestPixel(x, y);

    store.state.cachedPixelOwner.set(cacheKey, pixelOwner);
    return pixelOwner;
}

async function loadPixelOwner(x: number, y: number) {
    const cacheKey = x + "|" + y;
    if (!store.state.cachedPixelOwner.has(cacheKey)) {
        return await requestAndCachePixelOwner(x, y);
    }
    return store.state.cachedPixelOwner.get(cacheKey);
}

onUnmounted(() => {
    clearInterval(intervalFunc);
})

function onConfirmation() {
    emit("confirm");
    emit('leave');
    store.state.selectedPixel = null;
}

function onCancel() {
    emit("cancel");
    emit('leave');
    store.state.selectedPixel = null;
}

const updateCooldown = () => {
    if (!store.state.board) {
        store.dispatch("pushError", { message: "UI: Internal Error (200)" })
        return "";
    }

    const timeSincePlaced = Date.now() - store.state.lastTimePlaced;
    const cooldownLeft = Math.max(0, store.state.board.cooldown - timeSincePlaced);

    isCooldown.value = cooldownLeft > 0;

    const minutes = Math.floor(cooldownLeft / (60 * 1000));
    const seconds = Math.floor(cooldownLeft / 1000);

    loadingBarWidth.value = (cooldownLeft / store.state.board.cooldown) * 100 + "%";

    cooldownText.value = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

function updateDialogPosition() {
    if (!dialogWrapper.value) {
        store.dispatch("pushError", { message: "UI: Internal Error (202)" })
        return;
    }

    const { x, y, pixelSize } = props;

    const dialogWidth = dialogWrapper.value.getBoundingClientRect().width;
    const dialogHeight = dialogWrapper.value.getBoundingClientRect().height;
    const selectorCenterX = x + (pixelSize / 2);
    const selectorCenterY = y + (pixelSize / 2);
    const boardWidth = window.innerWidth;
    const boardHeight = window.innerHeight;


    let left = pixelSize * 0.5 + DIALOG_PADDING;
    dialogWrapper.value.style.transform = "translate(0, -50%)"

    if (x + pixelSize + dialogWidth + DIALOG_PADDING * 2 >= boardWidth) {
        left *= -1;
        dialogWrapper.value.style.transform = "translate(-100%, -50%)"
    }
    dialogWrapper.value.style.left = selectorCenterX + left + "px";
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

    .login-reminder {
        color: red;
        text-align: center;
        font-size: 0.9rem;
        padding: 5px 25px;
    }


    .owner-box {
        display: flex;
        padding: 5px;
        gap: 5px;

        .img {
            height: 30px;
            width: 30px;
            position: relative;

            >img {
                position: absolute;
                left: 0;
                top: 0;

                height: 30px;
                width: 30px;
                border-radius: 30px;
            }
        }

        div {
            display: flex;
            flex-direction: column;
        }

        span:nth-child(2) {
            color: gray;
            font-size: 14px;
        }

    }

    >.cooldown-box {
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

        >img {
            height: 20px;
        }

        .loading-bar {
            width: 0;
            height: 5px;
            background-color: red;
            border-radius: 3px;
            animation: loading-animation 1s linear;
        }

        @keyframes loading-animation {
            0% {
                background-color:red;
                width:100%;
            }
            100% {
                background-color:red;
                width:0;
            }
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

            &:active:hover:not([disabled]) {
                background-color: lightgray;
            }

            &[disabled] {
                filter: grayscale(1);
            }

            >img {
                height: 25px;
            }

            &:first-of-type>img {
                filter: invert(27%) sepia(96%) saturate(2791%) hue-rotate(111deg) brightness(98%) contrast(104%);
            }

            &:last-of-type>img {
                filter: invert(26%) sepia(68%) saturate(7495%) hue-rotate(354deg) brightness(93%) contrast(124%);
            }
        }
    }

    .timestamp {
        color: darkgray;
        cursor: pointer;
    }
}
</style>
