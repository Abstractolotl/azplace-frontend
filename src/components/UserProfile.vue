<template>
    <template  v-if="store.getters.loggedIn">
        <div class="user" :class="{expanded}">
            <img :src="profile" />
            <span> {{username}} </span>
            <img src="@/assets/logout.svg" @click="logout"/>
        </div>
        <div class="anonym">
            <input id="anonym" type="checkbox" :checked="store.state.user?.anonymous" @change="onAnonymous" /> 
            <label for="anonym" >Anonymous Mode</label>
            <span> Let everyone see which pixels you placed! </span>
        </div>
    </template>
    <div v-else class="login" @click="login" :class="{expanded}">
        <template v-if="waitingForLogin">
            <div class="loader"></div>
        </template>
        <template v-else>
            <img src="@/assets/login.svg"/>
            <span>Login</span>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { StoreData } from "@/types";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

import AzPlaceAPI from "@/api"

const store = useStore<StoreData>();

const DEFAULT_PROFILE = "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg";

const waitingForLogin = ref(false);

defineProps({
  expanded: {
    type: Boolean
  }
})

onMounted(() => {
    AzPlaceAPI.loadUser(() => {
        store.state.user = {
            name: "Kevin",
            avatarURL: ""
        }
    });
})

const username = computed(() => {
    return store.state.user?.name.toString() || "USER NOT FOUND";
})

const profile = computed(() => {
    return store.state.user?.avatarURL.toString() || DEFAULT_PROFILE;
})

function logout() {
    AzPlaceAPI.doLogout();
    store.state.user = null;
}

async function login() {
    waitingForLogin.value = true;
    await AzPlaceAPI.doLogin();
    waitingForLogin.value = false;
}

function onAnonymous(e: Event) {
    const input = e.target as HTMLInputElement;
    console.log(input.checked);
    AzPlaceAPI.changeSettings(input.checked);
}

</script>

<style scoped lang="scss">
@use "../variables.scss" as *;

$panel-height: 50px;
$icon-height: 25px;
$profile-size: 40px;

.user {
    display: flex;
    justify-content: center;
    align-items: center;
    height: $panel-height;
    position: relative;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);

        > img:last-of-type {
            opacity: 1;
        }
    }

    $image-padding: 5px;
    > span {
        margin-left: calc($profile-size + $image-padding * 3);
        margin-right: calc(15px + $icon-height);
        padding: 0px 5px;
        text-align: center;
    }

    > img:first-of-type {

        position: absolute;
        border-radius: 50%;
        left: calc($sidebar-max-width - $profile-size - $image-padding * 2);
        transition: $sidebar-expand-time;

        width: $profile-size;
        padding: $image-padding;
    }

    
    > img:last-of-type {
        filter: invert(26%) sepia(68%) saturate(7495%) hue-rotate(354deg) brightness(93%) contrast(124%);
        height: $icon-height;
        position: absolute;
        right: 15px;
        opacity: 0;
        cursor: pointer;
    }
    

    &.expanded > img:first-of-type {
        left: $image-padding;
    }

    > *:not(img) {
        opacity: 0;
        transition: $sidebar-expand-time;
    }

    &.expanded > * {
        opacity: 1;
    }
}

.login {
    height: $panel-height;
    
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    &.expanded > img {
        opacity: 0;
        right: 50%;
    }

    > img {
        filter: invert(1);
        height: $icon-height;

        position: absolute;
        right: $sidebar-hidden-width * 0.5 - $icon-height * 0.5;
        
        transition: $sidebar-expand-time * 0.75;
        opacity: 1;
    }

    .loader {
        border: 4px solid #f3f3f3; /* Light grey */
        border-top: 4px solid #3498db; /* Blue */
        border-radius: 50%;
        width: $icon-height;
        height: $icon-height;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
}

.anonym {
    text-align: center;
    position: relative;
    
    * {
        cursor: pointer;
        user-select: none;
    }

    input {
        transform: scale(1.5);
        margin-right: 10px;
    }

    > span {
        position: absolute;
        background-color: rgba(white, 0.75);
        border-radius: 5px;
        top: 25px;
        z-index: 150;

        color: black;
        display: none;
    }

    &:hover > span {
        display: block;
    }
}

</style>