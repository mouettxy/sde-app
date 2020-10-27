import Vue from 'vue'
import Vuetify, { VApp, VNavigationDrawer, VFooter, VToolbar, VFadeTransition } from 'vuetify/lib'
import { ClickOutside, Intersect, Mutate, Resize, Ripple, Scroll, Touch } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    VFadeTransition
  },
  directives: {
    Ripple,
    ClickOutside,
    Intersect,
    Mutate,
    Resize,
    Scroll,
    Touch
  }
})

const vuetifyOpts = {
  rtl: false,
  theme: {
    dark: false,
    options: {
      customProperties: true
    },
    themes: {
      dark: {
        primary: '#C79C00',
        accent: '#525252',
        accent2: '#1E1E1E',
        secondary: '#E0E0E0',
        success: '#689f38',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252',
        dark: '#181818',
        light: '#fafafa'
      },
      light: {
        primary: '#FFCC01',
        accent: '#525252',
        accent2: '#1E1E1E',
        secondary: '#E0E0E0',
        success: '#689f38',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252',
        dark: '#181818',
        light: '#fafafa'
      }
    }
  }
}

Vue.use(Vuetify)

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/src/styles/main.sass'

export default new Vuetify(vuetifyOpts)
