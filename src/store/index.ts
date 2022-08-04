import type { Board, StoreData } from "@/types";
import { reactive } from "vue";
import { createStore, Store } from "vuex";

//Mock data

export const store: Store<StoreData> = createStore({
    state: function() {
        return {
            canvas: null,
            lastTimePlaced: 0,
            selectedColorIndex: 0,
            selectedPixel: null,
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
        loggedIn: state => !!state.user,
        isOnCooldown: state => {
            if (!state.canvas) return true;
            return state.lastTimePlaced + (state.canvas.cooldown * 1000) > Date.now();
        },
        isSelecting: state => !!state.selectedPixel
    },
    mutations: {
    },
    actions: {
    },
});