import type { Canvas, StoreData } from "@/types";
import { createStore, Store } from "vuex";

export const store: Store<StoreData> = createStore({
    state: function() {
        return {
            canvas: {
                width: 4,
                height: 4,
                colors: ["#ff0000", "#00ff00", "#0000ff", "#00ffff", "#ff00ff"]
            },
            selectedColorIndex: 0,
            user: {
                name: 'Bobb',
                avatarURL: 'https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg',
            }
        }
    },
    getters: {
        canvasWidth: state => state.canvas.width,
        canvasHeight: state => state.canvas.height,
        user: state => state.user,
        loggedIn: state => !!state.user,
    },
    mutations: {
    },
    actions: {
    }
});