/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

import Auth from "../Warehouse/Auth";
import manageUser from "../Warehouse/admin/manageUser";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Auth,
    manageUser
  },
  state: {},
  mutations: {},
  actions: {}
});
