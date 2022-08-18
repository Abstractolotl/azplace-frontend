import type { StoreData } from "@/types";
import { createStore, Store } from "vuex";

export const store: Store<StoreData> = createStore({
    state: function() {
        return {
            board: null,
            lastTimePlaced: 0,
            selectedColorIndex: 0,
            selectedPixel: null,
            user: null,
            sidebar: {
                expanded: false,
                panel: "",
                width: 300
            },
            errors: [{}],
            cachedPixelOwner: new Map()
        }
    },
    getters: {
        loggedIn: state => !!state.user,
        isSelecting: state => !!state.selectedPixel
    },
    mutations: {
    },
    actions: {
        pushError: ({commit, state}, error) => {
            state.errors.push({
                message: error.message,
                time: error.time || Date.now()
            });
        }
    },
});