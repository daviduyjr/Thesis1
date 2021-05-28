/*eslint-disable */
import axios from "axios";

// const state = {
//   productList: [],
//   product: "",
//   newProduct: ""
// };
const prodState = () => {
  return {
    productList: [],
    newProduct: {},
    method: ""
  };
};
const state = prodState();
const getters = {
  productListGetter: state => state.productList
};

const actions = {
  resetCartState({ commit }) {
    commit("resetState");
  },
  async productList({ commit }) {
    try {
      //this.resetCartState();
      let res = await axios.get("http://localhost:5000/api/admin/productList");

      commit("PRODUCT_LIST_RESULT", res.data.products);
      debugger;
      return res;
    } catch (err) {
      let json = '{"msg": "No records available!", "success": false }';
      let msg = JSON.parse(json);
      return msg;
    }
  },

  async addProduct({ commit }, product) {
    try {
      let res = await axios.post("http://localhost:5000/api/admin/addProduct", {
        product: product
      });
      commit("ADD_PRODUCT", res.data.product);
      return res;
    } catch (err) {
      const error = { data: err.response.data };
      return error;
    }
  }
};

const mutations = {
  resetState(state) {
    Object.assign(state, prodState());
  },
  PRODUCT_LIST_RESULT(state, products) {
    state.productList = products;
  },
  ADD_PRODUCT(state, product) {
    state.newProduct = product;
    state.method = "addProduct";
    //dispatch("productList");
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
