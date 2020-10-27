import Vue from 'vue'
import VueTippy, { TippyComponent } from 'vue-tippy'

Vue.use(VueTippy)
// or
Vue.use(VueTippy, {
  directive: 'tippy',
  flipDuration: 1,
  flip: true,
  arrow: true,
  popperOptions: {
    modifiers: {
      preventOverflow: {
        enabled: true
      }
    }
  }
})

Vue.component('tippy', TippyComponent)

import 'tippy.js/themes/google.css'
