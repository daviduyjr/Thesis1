/*eslint-disable */
import axios from "axios";

const state = {
  productList: [],
  product: "",
  newProducts: ""
};

const getters = {
  productListGetter: state => state.productList
};

const actions = {
  async productList({ commit }) {
    try {
      let res = await axios.get("http://localhost:5000/api/admin/productList");
      // console.log(res.data.products);
      commit("product_list_result", res.data.products);
      return res;
    } catch (err) {
      let json = '{"msg": "No records available!", "success": false }';
      let msg = JSON.parse(json);
      return msg;
    }
  }
};

const mutations = {
  product_list_result(state, products) {
    state.productList = products;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
