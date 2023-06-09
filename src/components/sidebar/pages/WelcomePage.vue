<template>
<div class="panel">
    <h1> Welcome to az/Place </h1>
    <span>
    <strong>Team up with your co-hackers and create beautiful artworks together!</strong> <br /> <br/>
    Every few seconds you can place a pixel by clicking on it and choosing what color you want it to be. <br />
    Make sure to be logged in before trying to place a pixel. <br />
    <br />
    Inspired by Reddit's <i>r/Place</i> we created our own version: <strong>az/Place</strong>. <br /> <br />

    Want to know how az/Place works? You can checkout the project on <a href="https://github.com/Abstractolotl/">GitHub</a>,
    see the <a href="https://api.pixels.abstractolotl.de/swagger-ui/index.html">SwaggerUi</a>! <br /> <br />
    Have fun creating beautiful art by yourself, with your coworker or mess with the art of your co-hackers.

    If you run into any troubles please let us know by clicking the link at the very bottom. <br />
    <br />
    Be mindful of what you draw though, because inappropriate behaviour may be punished. <br /> (even when you're in anonymous mode)
    </span>
</div>
<BoardInfo v-if="store.state.board"/>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import BoardInfo from "./BoardInfo.vue";

const store = useStore();

</script>

<style lang="scss" scoped>

.panel {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    padding: 0 10px;
    margin-bottom: 25px;

    > h1 {
        font-size: 32px;
    }

    > span {
        overflow-y: auto;
    }
}

</style>