/*eslint-disable */
import axios from "axios";
import { AddCustomer } from "../../../../server/controller/admin/POS/customer";

const state = {
  customerList: [],
  customer: {}
};

const getters = {};

const actions = {
  async customerList({ commit }) {
    try {
      commit("RESET_FILTERED_CUSTOMER");
      let res = await axios.get("http://localhost:5000/api/admin/customerList");
      commit("CUSTOMER_LIST", res.data.customers);
      //console.log(res);
    } catch (err) {}
  },
  async filtercustomerList({ commit, state }, type) {
    const res = await state.customerList.filter(data => data.type == type);
    console.log(res);
    commit("FILTERED_CUSTOMER", res);
    return res;
  },
  async addCustomer({ commit }, customer) {
    try {
      let res = await axios.post(
        "http://localhost:5000/api/admin/addCustomer",
        {
          customer: customer
        }
      );
      return res.data;
    } catch (err) {}
  }
};

const mutations = {
  CUSTOMER_LIST(state, customers) {
    state.customerList = customers;
  },
  FILTERED_CUSTOMER(state, customers) {
    state.customerList.push(customers);
  },
  RESET_FILTERED_CUSTOMER(state, customers) {
    state.customerList = [];
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
