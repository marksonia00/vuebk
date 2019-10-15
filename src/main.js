// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store';
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css' 
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueAxios,axios)
Vue.use(Vuex)

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Access-Control-Allow-Headers'] = 'X-Requested-With,Content-Type';
axios.defaults.headers.post['Access-Control-Allow-Method'] = 'PUT,POST,GET,DELETE,OPTIONS';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
