/* eslint-disable */
import axios from "axios";
import { getReceivingOrderList } from "../../../../../server/controller/inventory/ReceivingOrder";

const state = {
  receivingOrdersList: []
};

const getters = {};

const actions = {
  async getReceivingOrderList({ commit }) {
    try {
      let res = await axios.get(
        "http://localhost:5000/api/admin/getReceivingOrderList"
      );

      if (res.data.success) {
        commit("GET_RECEIVINGORDER_LIST", res.data.result);
        return res.data;
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const mutations = {
  GET_RECEIVINGORDER_LIST(state, ROList) {
    state.getReceivingOrderList = ROList;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
