import Vuetify, { VBtn, VApp } from 'vuetify/lib'
import ru from 'vuetify/es5/locale/ru'

export const VuetifyPlugin = Vuetify
export const VuetifyAlacarte = {
  components: {
    VApp,
    VBtn,
  },
}

export const VuetifyInstance = new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#ee44aa',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
  },
  lang: {
    locales: { ru },
    current: 'ru',
  },
})

export default VuetifyInstance
