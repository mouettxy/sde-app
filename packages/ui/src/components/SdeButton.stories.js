import SdeButton from './SdeButton'
import vuetify from '@/plugins/vuetify'

export default {
  component: SdeButton,
  title: 'button',
  decorators: [() => ({ vuetify, template: '<v-app><story/></v-app>' })],
}

export const withText = () => ({
  components: { SdeButton },
  template: '<sde-button>Hello Button</sde-button>',
})
