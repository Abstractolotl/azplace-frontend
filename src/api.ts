import { useStore } from "vuex";
import { store } from "./store";
import type { Board, StoreData } from "./types";

const BASE_URL = "http://localhost:8080";
const DEFAULT_BOARD_ID = 0;

async function doLogout() {

}

async function loadBoard() {
    const config = await loadBoardConfig();
    const data = await loadBoardData();

    if(!config || !data) {
        store.dispatch("pushError", { message: "Could not load Board"})
        return;
    }

    store.state.canvas = { 
        ...config,
        initialData: data
    }
}

async function loadBoardConfig() {
    const endpoint = BASE_URL + "/board/" + DEFAULT_BOARD_ID + "/config";

    try {

        const response = await fetch(endpoint, { credentials: "include" })
        if(!response.ok) throw response;
        const boardConfig = await response.json();
        if(!boardConfig || !boardConfig.width || !boardConfig.height || !boardConfig.colors || !boardConfig.cooldown) {
            store.dispatch("pushError", { message: "Received bad data from Server"})
            return
        }

        return {
            width: boardConfig.size.width,
            height: boardConfig.size.height,
            colors: boardConfig.hex_colors,
            cooldown: boardConfig.cooldown
        }

    } catch (e) {
        store.dispatch("pushError", { message: "Could not load Board Config"})
        return;
    }

}

async function loadBoardData() {
    const endpoint = BASE_URL + "/board/" + DEFAULT_BOARD_ID + "/rawdata";

    try {
        const response = await fetch(endpoint, { credentials: "include" })
        if(!response.ok) throw response;

        return {
            pixels: new Uint8Array(await response.arrayBuffer())
        }
    } catch (e) {
        store.dispatch("pushError", { message: "Could not load Board Data"})
    }
}

async function doPlace() {
    const endpoint = BASE_URL + "/board/" + DEFAULT_BOARD_ID + "/place";

    try {
        const response = await fetch(endpoint, { credentials: "include" })
        if(!response.ok) throw response;
    } catch (e) {
        store.dispatch("pushError", { message: "Could not place Pixel"})
    }

    return true;
}

async function doLogin() {
    const endpoint = BASE_URL + "/login";

    try {
        const response = await fetch(endpoint, { credentials: "include" })

        if(!response.ok) {
            throw response;
        }
    } catch (e) {
        console.log("Got Some Error", e);
        store.dispatch("pushError", { message: "Login Failed"})
    }

}

export default {
    doLogin,
    doLogout,
    doPlace,
    loadBoard
}