/* eslint-disable */
import axios from "axios";
import router from "../../router";

const state = {
  distributors: {},
  distributorName: "",
  errorManageDistributors: ""
};

const getters = {
  distributorList: state => state.distributors
};

const actions = {
  async distributorList({ commit }, distributor) {
    try {
      commit("CATEGORY_LIST_REQUEST");
      let res = await axios.get(
        "http://localhost:5000/api/admin/distributorList"
      );
      if (res.data.success) {
        commit("DISTRIBUTOR_LIST_RESULT", res);
        return res;
      }
    } catch (err) {
      commit("DISTRIBUTOR_LIST_ERROR", err);
    }
  },

  async addCategory({ commit }, distributor) {
    try {
      let res = await axios.post(
        "http://localhost:5000/api/admin/addDistributor",
        { categoryName: distributor }
      );

      if (res.data.success === true) {
        commit("NEW_CATEGORY_SUCCESS", res);
        return res;
      }
    } catch (err) {
      const error = { data: err.response.data };
      return error;
    }
  },

  async editDistributor({ commit }, distributor) {
    try {
      let res = await axios.put(
        "http://localhost:5000/api/admin/updateDistributor",
        {
          dist_no: distributor.dist_no,
          distributor_name: distributor.distributor_name,
          address: distributor.address,
          contact_number: distributor.contact_number
        }
      );

      if (res.data.success === true) {
        commit("EDIT_DISTRIBUTOR_SUCCESS", res);
        return res;
      }
    } catch (err) {
      const error = { data: err.response.data };
      commit("EDIT_CATEGORY_ERROR", error);
      return error;
    }
  }
};

const mutations = {
  DISTRIBUTOR_LIST_RESULT(state, distributor) {
    state.categories = distributor.data.categories;
    state.errorManageProduct = null;
  },
  NEW_CATEGORY_SUCCESS(state, distributor) {
    this.catName = distributor.data.categories;
  },
  EDIT_DISTRIBUTOR_SUCCESS(state, distributor) {
    state.catName = distributor.data.categories.category_name;
  },
  EDIT_CATEGORY_ERROR(state, error) {
    state.error = error.data.err;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
