<template>
  <div class="user dropdown" @click="">
    <img :src="user.avatarURL" alt="avatar" />

    <div class="dropdown-content">
      <span>{{ user.username }}</span>
      <span>{{ user.email }}</span>

      <span class="pointer" @click="logout()" v-if="store.getters.loggedIn">Logout</span>
      <span class="pointer" @click="login()" v-else>Login</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useStore} from "vuex";

const store = useStore();

const user = {
  avatarURL: store.getters.user.avatarURL || 'https://cdn.discordapp.com/emojis/539227703841390592.webp?size=128&quality=lossless',
  username: store.getters.user.username || 'Benutzer',
  email: store.getters.user.email || 'test@test.de'
}

const login = () => {
  //TODO
}

const logout = () => {
  //TODO
}
</script>

<style scoped lang="scss">
.user {
  font-family: 'Open Sans', sans-serif;
  line-height: 12px;
  font-size: 25px;
  margin-top: 1px;
  position: absolute;
  top: 0;
  right: 0;

  img {
    border-radius: 50%;

    &:hover {
      outline: 2px solid black;
      cursor: pointer;
    }
  }
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #121212;
  min-width: 160px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  z-index: 1;
  right: 0;

  span {
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }
}

.dropdown:hover .dropdown-content {display: block;}

.pointer {
  cursor: pointer;
}
</style>