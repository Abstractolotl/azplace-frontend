import { createStore, Store } from "vuex";

export const store: Store<any> = createStore({
    state: function() {
        return {
            canvas: {
                width: 4,
                height: 4,
            }
        }
    },
    getters: {
        canvasWidth: state => state.canvas.width,
        canvasHeight: state => state.canvas.height
    }
});