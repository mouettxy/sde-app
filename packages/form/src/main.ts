import Vue from 'vue'
import App from './App.vue'

import './plugins/cookies'
import './plugins/axios'
import './plugins/map'
import './plugins/notifications'
import './plugins/tippy'
import './plugins/mask'
import './plugins/tour'
import './plugins/socket'

import vuetify from './plugins/vuetify'

import i18n from './i18n'

import store from './store'

Vue.config.productionTip = false

if (Vue.$cookies.get('locale')) {
  i18n.locale = Vue.$cookies.get('locale')
}

new Vue({
  vuetify,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
