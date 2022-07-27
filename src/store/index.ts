import { createStore, Store } from "vuex";

export const store: Store<any> = createStore({
    state: function() {
        return {
            canvas: {
                width: 4,
                height: 4,
            },
            colors: [],
            selectedColor: ''
        }
    },
    getters: {
        canvasWidth: state => state.canvas.width,
        canvasHeight: state => state.canvas.height
    },
    mutations: {
        SET_SELECTED_COLOR: (state, color) => {
            state.selectedColor = color;
        }
    },
    actions: {
        setSelectedColor(context, color) {
            context.commit('SET_SELECTED_COLOR', color);
        }
    }
});