import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.prototype.$api_host = 'http://89-108-77-215.cloudvps.regruhosting.ru/'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
