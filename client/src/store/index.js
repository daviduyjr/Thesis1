/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

import Auth from "../Warehouse/Auth";
import manageUser from "../Warehouse/admin/manageUser";
import manageCategory from "../Warehouse/admin/manageCategory";
import manageDistributor from "../Warehouse/admin/manageDistributor";
import productDetails from "../Warehouse/admin/productDetails";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Auth,
    manageUser,
    manageCategory,
    manageDistributor,
    productDetails
  },
  state: {},
  mutations: {},
  actions: {}
});
