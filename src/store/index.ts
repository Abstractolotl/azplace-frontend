import { createStore, Store } from "vuex";

export const store: Store<any> = createStore({
    state: function() {
        return {
            canvas: {
                width: 16,
                height: 16,
            }
        }
    },
    getters: {
        canvasWidth: state => state.canvas.width,
        canvasHeight: state => state.canvas.height
    }
});