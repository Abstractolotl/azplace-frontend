<template>
  <div class="dialogWrapper" @click="maybeHide()">
    <div class="dialog"
         @mouseleave="leftDialog()"
         @mouseenter="enteredDialog()">
      <div class="body">
        <div class="header">
          <h3>Are you sure?</h3>
        </div>
        <div class="bottom">
          <div class="form">
            <input type="text" v-model="reason" minlength="5" placeholder="Ban reason">
            <div>
              <input type="checkbox" id="forceTime" v-model="timeSelect" checked>
              <label for="forceTime">Ban permanently</label>
            </div>
            <div>
              <input :disabled="timeSelect" type="number" min="1" max="24" v-model="timeAmount">
              <select :disabled="timeSelect" v-model="timeType">
                <option value="0">Hours</option>
                <option value="1">Days</option>
                <option value="2">Weeks</option>
                <option value="3">Months</option>
              </select>
            </div>
            <div>
              <button type="button" :disabled="!filledIn()" @click="performBan()">Ban now</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import type { StoreData } from "@/types";
import {ref} from "vue";
import AzPlaceAPI from "@/api";

const store = useStore<StoreData>();

const reason = ref<string>();
const timeSelect = ref<boolean>(false)
const timeAmount = ref<number>(1);
const timeType = ref<number>(0)

const onDialog = ref<boolean>(false);

const timeTypes = [
        3_600_000,
       86_400_000,
      604_800_000,
    2_419_200_000
]

function enteredDialog() {
  onDialog.value = true;
}

function leftDialog() {
  onDialog.value = false;
}

function maybeHide() {
  if(!onDialog.value){
    store.state.banData = null;
  }
}

function filledIn(){
  return reason.value
      && (timeSelect.value || timeAmount.value > 0
          && timeType.value >= 0 && timeType.value <= 3);
}

function performBan(){
  store.state.banData!.reason = reason.value!;
  store.state.banData!.time = timeSelect.value ? -1 : timeAmount.value * timeTypes[timeType.value];

  AzPlaceAPI.banUser(store.state.banData!.userId, store.state.banData!.reason, store.state.banData!.time)
  store.state.banData = null;
}
</script>

<style lang="scss" scoped>
.form{
  padding: 0px 15px;

  display: flex;
  flex-direction: column;
  gap: 10px;

}
.dialogWrapper {
  top: 0;
  right: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 103;

  background-color: rgba(0, 0, 0, 0.5);
}
.dialog {
  z-index: 104;

  $height: 250px;
  $width: 500px;
  position: absolute;
  top: calc(50% - $height * 0.5);
  left: calc(50% - $width * 0.5);

  height: $height;
  width: $width;

  border-radius: 5px;
  background-color: white;

  .body {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;

    text-align: center;

    .header {
      justify-self: end;
    }

    .bottom {
      flex-grow: 1;
    }
  }
}
</style>