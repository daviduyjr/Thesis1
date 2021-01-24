/* eslint-disable */
import axios from "axios";
import router from "../../router";

const state = {
  categories: {},
  errorManageProduct: ""
};

const getters = {
  categoryList: state => state.categories
};

const actions = {
  async categoryList({ commit }, catData) {
    try {
      commit("CATEGORY_LIST_REQUEST");
      let res = await axios.get("http://localhost:5000/api/admin/categoryList");
      if (res.data.success) {
        commit("CATEGORY_LIST_RESULT", res);
        return res;
      }
    } catch (err) {
      commit("CATEGORY_LIST_ERROR", err);
    }
  }
};

const mutations = {
  CATEGORY_LIST_REQUEST() {
    state.errorManageProduct = null;
  },
  CATEGORY_LIST_RESULT(state, catData) {
    state.categories = catData.data.categories;
    state.errorManageProduct = null;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
