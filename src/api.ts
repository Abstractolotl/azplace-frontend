import { useStore } from "vuex";
import { store } from "./store";
import type { Board, StoreData } from "./types";

const BASE_URL = "https://api.azplace.azubi.server.lan";
const DEFAULT_BOARD_ID = 2;

const DEFAULT_REQUEST_HEADERS: RequestInit = {
    credentials: "include",
    
}

async function loadUser() {
    const endpoint = BASE_URL + "/user/";

    try {
        const response = await fetch(endpoint, DEFAULT_REQUEST_HEADERS)

        if(!response.ok) {
            throw response;
        }

        const profile = await response.json();
        if(!profile || !profile.name) {
            store.dispatch("pushError", { message: "Received bad data from Server"})
            return;
        }

        store.state.user = {
            name: profile.name,
            avatarURL: ""
        }

    } catch (e) {
        store.dispatch("pushError", { message: "Login Failed"})
    }
}

async function doLogin() {
    const endpoint = BASE_URL + "/auth/login";
    window.location.href = endpoint
}

async function doLogout() {
    const endpoint = BASE_URL + "/auth/logout";

    try {
        const response = await fetch(endpoint, DEFAULT_REQUEST_HEADERS)
        if(!response.ok) throw response;
    } catch (e) {
        store.dispatch("pushError", { message: "Logout Failed"})
    }
}

async function loadBoard() {
    const config = await loadBoardConfig();
    const data = await loadBoardData();

    console.log(data);

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

        const response = await fetch(endpoint, DEFAULT_REQUEST_HEADERS)
        if(!response.ok) throw response;
        const boardConfig = await response.json();
        if(!boardConfig || !boardConfig.size || !boardConfig.hex_colors || !boardConfig.cooldown) {
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
    const endpoint = BASE_URL + "/board/" + DEFAULT_BOARD_ID + "/data";

    try {
        const response = await fetch(endpoint, DEFAULT_REQUEST_HEADERS)
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
        const response = await fetch(endpoint, {
            ...DEFAULT_REQUEST_HEADERS,
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                x: store.state.selectedPixel?.x,
                y: store.state.selectedPixel?.y,
                color_index: store.state.selectedColorIndex
            })
        })
        if(!response.ok) throw response;
    } catch (e) {
        store.dispatch("pushError", { message: "Could not place Pixel"})
    }

    return true;
}

export default {
    doLogin,
    doLogout,
    doPlace,
    loadBoard,
    loadUser
}