/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import Auth from "../Warehouse/Auth";
import manageUser from "../Warehouse/admin/manageUser";
import manageCategory from "../Warehouse/admin/manageCategory";
import manageDistributor from "../Warehouse/admin/manageDistributor";
import productDetails from "../Warehouse/admin/productDetails";
import receivingOrder from "../Warehouse/admin/inventory/receivingOrder";
import POS from "../Warehouse/POS/POS";
import Customer from "../Warehouse/POS/Customer";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Auth,
    manageUser,
    manageCategory,
    manageDistributor,
    productDetails,
    receivingOrder,
    POS,
    Customer
  },
  state: {},
  plugins: [createPersistedState()],
  mutations: {},
  actions: {}
});
