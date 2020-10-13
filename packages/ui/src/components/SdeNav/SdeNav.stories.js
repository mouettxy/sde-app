import { generateStorybookHeader } from '../../helpers/_storybookHeader'
import { color, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

const storybook = generateStorybookHeader('Nav', 'outer')

storybook.add('default', () => ({
  template: /* html */ `
  <sde-nav @click-menu="action" :color="color" :title="title"></sde-nav>
  `,
  props: {
    title: {
      type: String,
      default: text('title', 'With title'),
    },
    color: {
      type: String,
      default: color('color', 'primary'),
    },
  },
  methods: { action: action('clicked') },
}))
