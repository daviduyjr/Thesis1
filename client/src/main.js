// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from "vue";
import App from "./App";
import router from "./router";
import BootstrapVue from "bootstrap-vue";
import JQuery from "jquery";
import VueSlideBar from "vue-slide-bar";
import VueSweetalert2 from "vue-sweetalert2";
import VueGoodWizard from "vue-good-wizard";
import axios from "axios";
import VueTheMask from "vue-the-mask";

import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize
} from "vee-validate";
import en from "vee-validate/dist/locale/en.json";
import * as rules from "vee-validate/dist/rules";

import store from "./store/index";
// eslint-disable-next-line
let $ = JQuery;

const options = {
  confirmButtonColor: "#41b882",
  cancelButtonColor: "#ff7674"
};

// Install VeeValidate rules and localization
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

localize("en", en);

// Install VeeValidate components globally
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

Vue.use(BootstrapVue);
Vue.use(VueSweetalert2, options);
Vue.use(VueGoodWizard);
Vue.use(VueTheMask);

Vue.component("vue-slide-bar", VueSlideBar);
Vue.config.productionTip = false;

Vue.prototype.$http = axios;
const token = localStorage.getItem("token");

if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: {
    App
  },
  store,
  template: "<App/>"
});
