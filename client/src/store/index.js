/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

import Auth from "../Warehouse/Auth";
import manageUser from "../Warehouse/admin/manageUser";
import manageProduct from "../Warehouse/admin/manageProduct";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Auth,
    manageUser,
    manageProduct
  },
  state: {},
  mutations: {},
  actions: {}
});
