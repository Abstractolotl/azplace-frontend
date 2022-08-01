import type { Board, StoreData } from "@/types";
import { reactive } from "vue";
import { createStore, Store } from "vuex";

//Mock data

export const store: Store<StoreData> = createStore({
    state: function() {
        return {
            canvas: null,
            selectedColorIndex: 0,
            selecting: false,
            user: {
                name: 'Bobb',
                avatarURL: 'https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg',
            },
            sidebar: {
                expanded: false,
                panel: "",
                width: 250
            }
        }
    },
    getters: {
        canvasWidth: state => state.canvas?.width,
        canvasHeight: state => state.canvas?.height,
        user: state => state.user,
        loggedIn: state => !!state.user,
    },
    mutations: {
    },
    actions: {
    },
});