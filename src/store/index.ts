import type { Board, StoreData } from "@/types";
import { reactive } from "vue";
import { createStore, Store } from "vuex";

//Mock data

export const store: Store<StoreData> = createStore({
    state: function() {
        return {
            canvas: null,
            canvasInfo: {
                id: 0,
                width: 10,
                height: 10,
                cooldown: 10,
                colors: ["#ff0000", "#00ff00", "#0000ff", "#00ffff", "#ff00ff"]
            },
            lastTimePlaced: 0,
            selectedColorIndex: 0,
            selectedPixelX: -1,
            selectedPixelY: -1,
            selecting: false,
            user: {
                name: 'Bobb',
                avatarURL: 'https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg',
            },
            sidebar: {
                expanded: false,
                panel: "",
                width: 250
            },
            randomNumber: ""
        }
    },
    getters: {
        canvasWidth: state => state.canvasInfo?.width,
        canvasHeight: state => state.canvasInfo?.height,
        user: state => state.user,
        loggedIn: state => !!state.user,
    },
    mutations: {
    },
    actions: {
    },
});