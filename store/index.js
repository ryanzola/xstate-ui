import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      sideNav: false
    }),
    getters: {
      getSide(state) {
        return state.sideNav
      }
    },
    mutations: {
      flipSide(state) {
        state.sideNav = !state.sideNav
        console.log(state.sideNav)
      }
    },
    actions: {
      onFlipSide({ commit }) {
        commit('flipSide')
      }
    }
  })
}

export default createStore
