import Vue from 'vue';
import App from './App.vue';
import router from './router.js';
import i18n from './i18n/index.js';
import './rem.js';

Vue.config.productionTip = false;
Vue.prototype.$I18n = i18n;

new Vue({
  render: h => h(App),
  router,
  i18n
}).$mount('#app')
