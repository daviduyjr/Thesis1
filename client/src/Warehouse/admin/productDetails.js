/*eslint-disable */
import axios from "axios";

const state = {
  productList: {},
  product: "",
  newProducts: ""
};

const getters = {};

const actions = {
  async productList({ commit }) {
    try {
      let res = await axios.get("http://localhost:5000/api/admin/productList");

      return res;
    } catch (err) {
      let json = '{"msg": "No records available!", "success": false }';
      let msg = JSON.parse(json);
      return msg;
    }
  }
};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations
};
