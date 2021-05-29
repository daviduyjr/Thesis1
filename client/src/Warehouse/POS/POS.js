/*eslint-disable */
import axios from "axios";

// const state = {
//   productList: [],
//   product: "",
//   newProduct: ""
// };
const prodState = () => {
  return {
    orderNo: "",
    productList: [],
    orderList: []
  };
};
const state = prodState();
const getters = {};

const actions = {
  async productListPOS({ commit }) {
    try {
      let res = await axios.get(
        "http://localhost:5000/api/admin/productListPOS"
      );

      commit("PRODUCT_LIST_POS", {
        products: res.data.products,
        orderNo: res.data.orderNo
      });

      return res;
    } catch (err) {
      console.log(err);
    }
  },

  async setOrderList({ commit }, order) {
    try {
      commit("SET_ORDER_LIST", order);
    } catch (err) {
      console.log(err);
    }
  },
  async removeItem({ commit }, index) {
    try {
      commit("REMOVE_ORDER", index);
    } catch (err) {
      console.log(err);
    }
  }
};

const mutations = {
  resetState(state) {
    Object.assign(state, prodState());
  },
  PRODUCT_LIST_POS(state, data) {
    state.productList = data.products;
    state.orderNo = data.orderNo;
  },
  SET_ORDER_LIST(state, order) {
    state.orderList.push(order);
  },
  REMOVE_ORDER(state, index) {
    state.orderList.splice(index, 1);
    for (var i = state.orderList.length - 1; i >= 0; i--) {}
    // state.orderList.splice(index);
    //state.orderList.push(order);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
