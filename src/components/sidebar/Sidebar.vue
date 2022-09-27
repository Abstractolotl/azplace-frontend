<template>
    <div ref="sidebar" class="sidebar">
        <UserProfile :expanded="navbarOpen" />
        
        <div ref="content" :class="{ hidden: !navbarOpen }" class="content">
            <Page v-if="store.state.sidebar.panel === 'palette'" title="Color Palette"> <ColorPalette /> </Page>
            <Page v-else-if="store.state.sidebar.panel === 'aboutus'" title="About Us"> <AboutUsPanel /></Page>
            <Page v-else-if="store.state.sidebar.panel === 'impressum'" title="Impressum"> <ImpressumPanel /></Page>
            <WelcomePanel v-else />
        </div>
        <BoardInfo v-if="store.state.board"/>
        <DownloadBoard/>
        <FooterPanel />
    </div>
</template>

<script setup lang="ts">
import type { StoreData } from "@/types";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import ColorTile from "./ColorTile.vue";
import UserProfile from "./UserProfile.vue";
import WelcomePanel from "./pages/WelcomePage.vue";
import FooterPanel from "./FooterPanel.vue";
import AboutUsPanel from "./pages/AboutUsPage.vue";
import Page from "./Page.vue";
import ImpressumPanel from "./pages/ImpressumPage.vue";
import ColorPalette from "./ColorPalette.vue";
import DownloadBoard from "@/components/sidebar/DownloadBoard.vue";
import BoardInfo from "./pages/BoardInfo.vue";

const store = useStore<StoreData>();
const sidebar = ref<HTMLElement>();
const content = ref<HTMLElement>();

let WIDTH_EXPANDED = 300;
const WIDTH_HIDDEN = 25;

let navbarOpen = ref(false);

function onNavigate(e: CustomEvent) {
    const page = e.detail.page;
    const width = e.detail.width;

    document.getRootNode

    store.state.sidebar.panel = page;
    changeWidth(width);


    if(e.detail.forceOpen) openNav();
    if(e.detail.forceClose) closeNav();
}

function changeWidth(width: number) {
    if(!sidebar.value || !content.value ) {
    store.dispatch("pushError", { message: "UI: Internal Error (401)"})
    return;
  }

    document.body.style.setProperty("--sidebar-width", width + "px");

    sidebar.value.style.width = width + "px";
    WIDTH_EXPANDED = width;

    const scale = width / WIDTH_EXPANDED;
    content.value.style.transform = `scale(${scale})`;
}

onMounted(() => {
    if (!sidebar.value)  {
        store.dispatch("pushError", { message: "UI: Internal Error (400)"})
        return;
    }

    changeWidth(store.state.sidebar.width.valueOf());

    closeNav();
    document.addEventListener("mousemove", e => {
        if (e.x <= 100 && !navbarOpen.value) openNav();
    })
    sidebar.value.addEventListener("mouseleave", closeNav);

    //@ts-ignore
    document.addEventListener("navigate", onNavigate)
    
})

const openNav = () => {
    if (!sidebar.value) {
        store.dispatch("pushError", { message: "UI: Internal Error (402)"})
        return;
    }

    sidebar.value.style.left = "0px";

    navbarOpen.value = true;
}

const closeNav = () => {
    if (!sidebar.value) {
        store.dispatch("pushError", { message: "UI: Internal Error (403)"})
        return;
    }

    if(store.getters.isSelecting) return;

    sidebar.value.style.left = (WIDTH_HIDDEN - WIDTH_EXPANDED) + "px";

    navbarOpen.value = false;
}
</script>

<style lang="scss">
@use "@/variables.scss" as *;

.sidebar {
    height: 100vh;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    background-color: #111;
    overflow: hidden;
    transition: $sidebar-expand-time;
    color: white;
    
    display: flex;
    flex-direction: column;

    a, a:visited {
        color: lightcyan;
    }


    .content {
        opacity: 1;
        transition: 0.5s;
        overflow: hidden;
        padding-bottom: 10px;

        //position: absolute;
        //left: 0;
        //top: 50px;
        transform-origin: top left;

        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: $sidebar-max-width;
        transform: scale(1);
    }

    .hidden {
        opacity: 0;
    }

}



.expand-hint {
    color: white;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 25px;
    padding-right: 10px;

    >* {
        opacity: 1;
        transition: 0.25s;
    }
}
.hidden {
    opacity: 0;
}

</style>