import SdeButton from './SdeButton'
import vuetify from '@/plugins/vuetify'
import { storiesOf } from '@storybook/vue'
import { withKnobs, color } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

const storybook = storiesOf('Button', module)
storybook.addDecorator(
  withKnobs({
    escapeHTML: false,
  }),
)

storybook.addDecorator(() => ({
  vuetify,
  template: '<v-app><v-main><v-container fluid><story/></v-container></v-main></v-app>',
}))

storybook.add('differentColors', () => ({
  components: { SdeButton },
  template: /* html */ `
    <div>
      <sde-button @click="action" color="primary"> primary </sde-button>
      <sde-button @click="action" color="secondary"> secondary </sde-button>
      <sde-button @click="action" color="error"> error </sde-button>
      <sde-button @click="action" color="success"> success </sde-button>
      <sde-button @click="action" color="info"> info </sde-button>
      <sde-button @click="action" color="#000"> hex color </sde-button>
      <sde-button @click="action" :color="color"> custom color </sde-button>
    </div>
  `,
  props: {
    color: {
      type: String,
      default: color('task', 'secondary'),
    },
  },
  methods: { action: action('clicked') },
}))

storybook.add('asIcon', () => ({
  components: { SdeButton },
  template: /* html */ `
    <div>
      <sde-button :color="color" icon @click="action"> mdi-account </sde-button>
      <sde-button :color="color" icon @click="action"> mdi-pencil </sde-button>
      <sde-button :color="color" icon @click="action"> mdi-car-lifted-pickup </sde-button>
      <sde-button :color="color" icon @click="action"> mdi-cards-spade </sde-button>
      <sde-button :color="color" icon @click="action"> mdi-chart-box </sde-button>
      <sde-button :color="color" icon @click="action"> mdi-snake </sde-button>
    </div>
  `,
  props: {
    color: {
      type: String,
      default: color('task', 'secondary'),
    },
  },
  methods: { action: action('clicked') },
}))

storybook.add('differentStyles', () => ({
  components: { SdeButton },
  template: /* html */ `
    <div>
      <sde-button :color="color" text> as text </sde-button>
    </div>
  `,
  props: {
    color: {
      type: String,
      default: color('task', 'secondary'),
    },
  },
  methods: { action: action('clicked') },
}))

storybook.add('addIcons', () => ({
  components: { SdeButton },
  template: /* html */ `
    <div>
      <sde-button @click="action" color="primary" prepend-icon="mdi-account"> prepend </sde-button>
      <sde-button @click="action" color="secondary" append-icon="mdi-pencil"> append </sde-button>
      <sde-button @click="action" color="error" prepend-icon="mdi-account" append-icon="mdi-pencil"> both </sde-button>
    </div>
  `,
  props: {
    color: {
      type: String,
      default: color('task', 'secondary'),
    },
  },
  methods: { action: action('clicked') },
}))
