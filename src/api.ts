import { useStore } from "vuex";
import { store } from "./store";
import type { Board, StoreData } from "./types";

const BASE_URL = "https://api.azplace.azubi.server.lan";

const params = new URLSearchParams(window.location.search);
const DEFAULT_BOARD_ID = params.has("board") ? params.get("board") : 1;

const DEFAULT_REQUEST_HEADERS: RequestInit = {
    credentials: "include",
    
}

let socket: WebSocket | null;

function setWebSocketHandler(handler: any) {
    socket = new WebSocket("wss://azplace.azubi.server.lan/ws");

    let attempts = 0;

    socket.addEventListener("message", (e) => {
        attempts = 0;
        handler(e)
    });
    socket.addEventListener("close", () => {
        // Dont send notification try to reconnect instead
        if(attempts < 3) {
            attempts++;
            setTimeout(() => {
                setWebSocketHandler(handler);
            }, 1500);
        } else {
            store.dispatch("pushError", { message: "Connection to WebSocket lost"})
        }
    })
    socket.addEventListener("error", (e) => {
        console.log(e);
        store.dispatch("pushError", { message: "Error with WebSocket connection"})
    })
}

async function loadUser(errorCallback: (error: any) => void) {
    const endpoint = BASE_URL + "/user/";

    try {
        const response = await fetch(endpoint, DEFAULT_REQUEST_HEADERS)

        if(!response.ok) {
            throw response;
        }

        const profile = await response.json();
        if(!profile || !profile.name || !profile.person_id) {
            store.dispatch("pushError", { message: "Received bad data from Server"})
            return;
        }

        store.state.user = {
            name: profile.name,
            avatarURL: "https://image.azubi.server.lan/picture/" + profile.person_id
        }

    } catch (e) {
        if(errorCallback) {
            errorCallback(e);
        } else {
            store.dispatch("pushError", { message: "Could not fetch Profile"})
        }
    }
}

async function doLogin() {
    const endpoint = BASE_URL + "/auth/login";
    window.location.href = endpoint;
}

async function doLogout() {
    const endpoint = BASE_URL + "/auth/logout";

    try {
        const response = await fetch(endpoint, DEFAULT_REQUEST_HEADERS)
        if(!response.ok) throw response;
    } catch (e) {
        store.dispatch("pushError", { message: "Logout Failed. Feature is not implemented. Delete your cookies if you really want to logout..."})
    }
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

async function requestPixel(x: number, y: number) {
    const endpoint = BASE_URL + "/board/" + DEFAULT_BOARD_ID + "/pixel/" + x + "/" + y;

    try {
        const response = await fetch(endpoint, DEFAULT_REQUEST_HEADERS)
        if(!response.ok) throw response;
        const pixelInfo = await response.json();

        if(response.status == 404) {
            return null;
        }

        if(!pixelInfo || !pixelInfo.username || !pixelInfo.person_id) {
            store.dispatch("pushError", { message: "Received bad data from Server"})
            return;
        }

        return {
            anonym: pixelInfo.username === "anonymous",
            username: pixelInfo.username,
            timestamp: pixelInfo.timestamp,
            avatarURL: "https://image.azubi.server.lan/picture/" + pixelInfo.person_id
        }

    } catch (e) {
        // Irrelevant is only disturbin user experience
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
    loadUser,
    setWebSocketHandler,
    requestPixel
}