import { createStore, Store } from "vuex";

export const store: Store<any> = createStore({
    state: function() {
        return {
            canvas: {
                width: 4,
                height: 4,
            },
            loggedIn: false,
            colors: [],
            selectedColor: '',
            user: {
                username: '',
                avatarURL: '',
                email: '',
                stats: {
                    pixelsPlaced: 0,
                    colorsUsed: 0
                },
                language: 'de',
                defaultColor: '',
                darkMode: true
            }
        }
    },
    getters: {
        canvasWidth: state => state.canvas.width,
        canvasHeight: state => state.canvas.height,
        user: state => state.user,
        loggedIn: state => state.loggedIn,
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