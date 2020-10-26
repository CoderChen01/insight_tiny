import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './element-ui'


Vue.config.productionTip = false

// custom directive
Vue.directive('title', {
  bind: function (el, binding) {
    let {value} = binding
    if(value) {
      document.title = value
    }
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

