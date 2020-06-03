import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    async initialLoad(context) {
      console.log("Mounting...");
    }
  },
  modules: {}
});
