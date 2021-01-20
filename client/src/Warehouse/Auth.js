/* eslint-disable */
import axios from "axios";
import router from "../router";

const auth_request = "auth_request";
const register_request = "register_request";

const state = {
  token: localStorage.getItem("token") || "",
  user: {},
  status: "",
  error: null,
  currentUserRole: ""
};

const getters = {
  // isLoggedIn: (state) => {
  //   if (state.token != '') {
  //     return state.token
  //   }
  //   else
  //   {
  //     return false
  //   }
  // },
  isLoggedIn: state => !!state.token,
  authState: state => state.status,
  user: state => state.user,
  error: state => state.error,
  isUser: state => {
    if (state.user.role === "user") {
      return true;
    } else {
      return false;
    }
  },
  isSupervisor: state => {
    if (state.user.role === "supervisor") {
      return true;
    } else {
      return false;
    }
  },
  isAdmin: state => {
    if (state.user.role === "admin") {
      return true;
    } else {
      return false;
    }
  },
  currentUserRole: state => state.user.role
};

const actions = {
  //login actions
  async login({ commit }, user) {
    try {
      commit(auth_request);
      let res = await axios.post("http://localhost:5000/api/login", user);
      if (res.data.success) {
        const token = res.data.token;
        const user = res.data.user;
        const data = [{ token: token }, { user: user }];
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = token;
        commit("auth_success", data);
      }
      return res;
    } catch (err) {
      commit("auth_error", err);
    }
  },

  // async register({ commit }, userData) {
  //   try {
  //     commit(register_request);
  //     let res = await axios.post(
  //       "http://localhost:5000/api/admin/register",
  //       userData
  //     );
  //     console.log(res.data);
  //     if (res.data.success !== "undefined") {
  //       commit("register_success");
  //     }
  //     return res;
  //   } catch (err) {
  //     commit("register_error", err);
  //   }
  // },

  async profile({ commit }) {
    commit("profile_request");
    let res = await axios.get("http://localhost:5000/api/admin/profile");
    commit("user_profile", res.data.user);
    return res;
  },

  async logout({ commit }) {
    await localStorage.removeItem("token");
    commit("logout");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/pages/login");
    return;
  }
};

const mutations = {
  auth_request() {
    state.status = "loading";
    state.error = null;
  },
  auth_success(state, data) {
    state.token = data[0].token;
    state.user = data[1].user;
    state.status = "success";
    state.error = null;
    state.currentUserRole = data[1].user.role;
    localStorage.setItem("role", data[1].user.role);
  },
  auth_error(state, err) {
    state.error = err.response.data.msg;
  },
  // register_request() {
  //   state.status = "loading";
  //   state.error = null;
  // },
  // register_success(userData) {
  //   state.status = "success";
  //   state.error = null;
  // },
  // register_error(state, err) {
  //   state.error = err.response.data.msg;
  // },
  logout(state) {
    state.status = "";
    state.token = "";
    state.user = "";
    state.error = null;
  },
  profile_request(state) {
    state.status = "loading";
  },
  user_profile(state, user) {
    state.user = user;
    state.currentUserRole = user.role;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
