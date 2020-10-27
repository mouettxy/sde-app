import Vue from 'vue'
import * as GmapVue from 'gmap-vue'

const locale = Vue.$cookies.get('locale')

Vue.use(GmapVue, {
  load: {
    key: process.env.VUE_APP_GOOGLE_API_KEY,
    libraries: 'places,directions',
    region: locale === 'en' ? 'US' : 'RU',
    language: locale ? locale : 'ru',
  },
  installComponents: true,
})
