
// @ts-nocheck 
        
import type { Board, StoreData } from "@/types";
import { reactive } from "vue";
import { createStore, Store } from "vuex";

export const store: Store<StoreData> = createStore({
    state: function() {
        return {
            board: null,
            lastTimePlaced: 0,
            selectedColorIndex: 0,
            selectedPixel: null,
            user: null,
            banData: null,
            sidebar: {
                expanded: false,
                panel: "",
                width: 300
            },
            errors: [],
            cachedPixelOwner: new Map()
        }
    },
    getters: {
        loggedIn: state => !!state.user,
        isSelecting: state => !!state.selectedPixel,
        active: state => state.board.started && !state.board.ended
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