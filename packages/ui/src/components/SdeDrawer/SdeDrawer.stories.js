import { generateStorybookHeader } from '../../helpers/_storybookHeader'
import { color, text, object } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

const storybook = generateStorybookHeader('Drawer', 'outer')

storybook.add('default', () => ({
  template: /* html */ `
    <sde-drawer :menu="menu"></sde-drawer>
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
    menu: {
      type: Object,
      default: object('menu', [
        {
          title: 'Кнопка',
          action: action('clicked'),
          icon: 'mdi-account',
        },
      ]),
    },
  },
  methods: { action: action('clicked') },
}))
