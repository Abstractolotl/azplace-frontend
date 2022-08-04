
// @ts-nocheck 
        
import type { Board, StoreData } from "@/types";
import { reactive } from "vue";
import { createStore, Store } from "vuex";

export const store: Store<StoreData> = createStore({
    state: function() {
        return {
            canvas: null,
            lastTimePlaced: 0,
            selectedColorIndex: 0,
            selectedPixel: null,
            user: null,
            sidebar: {
                expanded: false,
                panel: "",
                width: 250
            },
            errors: []
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
        pushError: ({commit, state}, error) => {
            state.errors.push({
                message: error.message,
                time: error.time || Date.now()
            });
        }
    },
});