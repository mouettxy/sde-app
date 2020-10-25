import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './plugins/axios'
import vuetify from './plugins/vuetify'
import './plugins/particles'
import './plugins/notifications'
import './plugins/socket'
import './plugins/progress-bar'
import './plugins/components'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
