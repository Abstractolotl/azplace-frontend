
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
        
        /*isOnCooldown: state => {
            console.log(!!state.canvas, Date.now() - state.lastTimePlaced, (state.canvas.cooldown * 1000), Date.now() - state.lastTimePlaced < state.canvas.cooldown * 1000)
            if (!state.canvas) return true;
            return Date.now() - state.lastTimePlaced < (state.canvas.cooldown * 1000);
        },*/
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