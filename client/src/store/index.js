/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

import Auth from "../Warehouse/Auth";
import manageUser from "../Warehouse/admin/manageUser";
import manageProduct from "../Warehouse/admin/manageProduct";
import manageDistributor from "../Warehouse/admin/manageDistributor";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Auth,
    manageUser,
    manageProduct,
    manageDistributor
  },
  state: {},
  mutations: {},
  actions: {}
});
