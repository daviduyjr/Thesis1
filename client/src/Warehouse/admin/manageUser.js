/* eslint-disable */
import axios from "axios";
import router from "../../router";

const register_request = "register_request";

const state = {
  newUser: {},
  errorManageUser: "",
  newUserId: "",
  userUpdated: {},
  method: ""
};

const getters = {
  newUser: state => state.newUser,
  errorManageUser: state => state.errorManageUser,
  userUpdated: state => state.userUpdated
};

const actions = {
  async register({ commit }, userData) {
    try {
      commit(register_request);
      let res = await axios.post(
        "http://localhost:5000/api/admin/register",
        userData
      );
      if (res.data.success === true) {
        commit("register_success", res.data.newUser);
        return res;
      }
      if (res.data.success === false) {
        return res;
      }
    } catch (err) {
      const error = { data: err.response.data };
      return error;
    }
  },

  async newUserInfo({ commit }, userData) {
    try {
      commit("new_user_profile_request");
      console.log("this is userData", userData.role);

      let res = await axios.get("http://localhost:5000/api/admin/newUser", {
        params: {
          id: userData.id,
          role: userData.role
        }
      });
      if (res.data.success) {
        commit("new_user_profile_success", res.data);
        return res;
      }
    } catch (err) {
      commit("new_user_profile_error", err);
    }
  },

  async editUserInfo({ commit }, userData) {
    try {
      let res = await axios.put(
        "http://localhost:5000/api/admin/updateUsersProfile",
        userData
      );

      if (res.data.success === true) {
        commit("update_user_success", res.data);
        return res;
      }
      if (res.data.success === false) {
        return res;
      }
    } catch (err) {
      const error = { data: err.response.data };
      return error;
    }
  }
};

const mutations = {
  register_request() {
    state.status = "loading";
    state.errorManageUser = null;
  },
  register_success(state, userData) {
    console.log(userData);
    state.status = "success";
    state.errorManageUser = null;
    state.method = "addUser";
    state.newUser = userData;
  },
  register_error(state, err) {
    state.errorManageUser = err.response.data.msg;
  },
  new_user_profile_request() {
    state.status = "loading";
    state.errorManageUser = null;
  },
  new_user_profile_success(state, res) {
    state.newUser = res.data.user;
  },
  new_user_profile_error(state, err) {
    console.log(err);
    state.errorManageUser = err.response.data.msg;
  },
  update_user_success(state, data) {
    state.method = "updateUser";
    state.userUpdated = data.user;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
