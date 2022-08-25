import Vue from 'vue'
import App from './App.vue'
import axios from "@/lib/axios";
import ClapVueCore from "@clapjs/vue-core";

Vue.use(ClapVueCore,{axios})

import configDefault from "@/config/config.default";
import configUrl from "@/config/config.url";

import i18n from "@/lib/i18n";
import router from "@/lib/router";
import store from "@/lib/store";
import bootstrap from './bootstrap'

Vue.prototype.$config=configDefault;
Vue.prototype.$config.url=configUrl;

Vue.config.productionTip = false;

new Vue({router, store, i18n, created: bootstrap, render: h => h(App)}).$mount('#app');
