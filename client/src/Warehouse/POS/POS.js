/*eslint-disable */
import axios from "axios";
import { getTransactionById } from "../../../../server/controller/admin/POS/transaction";

// const state = {
//   productList: [],
//   product: "",
//   newProduct: ""
// };
const prodState = () => {
  return {
    orderNo: "",
    productList: [],
    orderList: [],
    adminId: "",
    successTransaction: {}
  };
};
const state = prodState();
const getters = {};

const actions = {
  async POSSecurity({ commit }, securityCode) {
    try {
      let res = await axios.post(
        "http://localhost:5000/api/admin/posSecurity",
        {
          securityCode: securityCode
        }
      );
      commit("SECURITY_SUCCESS", res.data.userId);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  async productListPOS({ commit }) {
    try {
      let res = await axios.get(
        "http://localhost:5000/api/admin/productListPOS"
      );

      if (res.data.success == true) {
        commit("PRODUCT_LIST_POS", {
          products: res.data.products,
          orderNo: res.data.orderNo
        });
      } else {
        commit("PRODUCT_LIST_POS", {
          products: [],
          orderNo: res.data.orderNo
        });
      }

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
  },
  async payment({ commit }, item) {
    try {
      let res = await axios.post("http://localhost:5000/api/admin/payment", {
        data: item
      });

      commit("TRANSACTION_SUCCESS", res.data.trans);

      return res;
    } catch (err) {}
  },

  async getTransactionById({ commit }, id) {
    try {
      let res = await axios.get(
        `http://localhost:5000/api/admin/transactionId/${id}`
      );
      //console.log(res.data);
      return res;
    } catch (err) {}
  }
};

const mutations = {
  resetState(state) {
    Object.assign(state, prodState());
  },
  async PRODUCT_LIST_POS(state, data) {
    state.productList = [];
    await state.productList.push(data.products);
    state.orderNo = data.orderNo;
  },
  SET_ORDER_LIST(state, order) {
    state.orderList.push(order);
  },
  REMOVE_ORDER(state, index) {
    state.orderList.splice(index, 1);
    for (var i = state.orderList.length - 1; i >= 0; i--) {}
  },
  TRANSACTION_SUCCESS(state, trans) {
    state.orderList = [];
    state.successTransaction = trans;
  },
  SECURITY_SUCCESS(state, userId) {
    state.adminId = userId;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
