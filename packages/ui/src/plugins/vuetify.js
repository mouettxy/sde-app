import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import { VApp, VMain, VContainer, VBtn, VIcon } from 'vuetify/lib'
import 'vuetify/src/styles/styles.sass'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

export const VuetifyPlugin = Vuetify
export const VuetifyAlacarte = {
  components: {
    VApp,
    VMain,
    VContainer,
    VBtn,
    VIcon,
  },
}

Vue.use(VuetifyPlugin, VuetifyAlacarte)

export const VuetifyInstance = new Vuetify({
  theme: {
    dark: false,
    options: {
      customProperties: true,
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
        light: '#fafafa',
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
        light: '#fafafa',
      },
    },
  },
})

export default VuetifyInstance
