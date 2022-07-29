<template>
    <div v-if="store.getters.loggedIn" class="user" :class="{expanded}">
        <img :src="profile" />
        <span> {{username}} </span>
        <img src="@/assets/logout.svg" @click="logout"/>
    </div>
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

const store = useStore<StoreData>();

const DEFAULT_PROFILE = "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg";

const waitingForLogin = ref(false);

defineProps({
  expanded: {
    type: Boolean
  }
})

const username = computed(() => {
    return store.state.user?.name.toString() || "USER NOT FOUND";
})

const profile = computed(() => {
    return store.state.user?.avatarURL.toString() || DEFAULT_PROFILE;
})

function logout() {
    //TODO

    //send logout to backend
    store.state.user = null;
}

function login() {
    //TODO

    // get user from backend
    waitingForLogin.value = true;
    setTimeout(() => {
        waitingForLogin.value = false;
        store.state.user = {
            name: "Bobby",
            avatarURL: "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg"
        }
    }, 2000)
}

</script>

<style scoped lang="scss">
@use "../variables.scss" as *;

$panel-height: 50px;
$icon-height: 25px;

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

    > img:first-of-type {
        position: absolute;
        border-radius: 50%;
        right: 0;
        transition: $sidebar-expand-time;

        $image-padding: 7px;
        width: $sidebar-hidden-width - calc(2 * $image-padding);
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
        right: $sidebar-max-width - $sidebar-hidden-width ;
    }
    > *:not(img) {
        opacity: 0;
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
    }

    > img {
        filter: invert(1);
        height: $icon-height;

        position: absolute;
        right: $sidebar-hidden-width * 0.5 - $icon-height * 0.5;
        
        transition: $sidebar-expand-time * 0.5;
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

</style>