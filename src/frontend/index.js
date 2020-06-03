import Vue from "vue";
import App from "./components/App.vue";
import router from "./router";
import store from "./store";

import BootstrapVue from "bootstrap-vue";
import "./assets/styles.scss";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#root");
