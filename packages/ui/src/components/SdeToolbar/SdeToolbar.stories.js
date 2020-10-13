import { generateStorybookHeader } from '../../helpers/_storybookHeader'
import { color, text } from '@storybook/addon-knobs'

const storybook = generateStorybookHeader('Toolbar', 'inner')

storybook.add('default', () => ({
  template: /* html */ `
  <div>
    <sde-toolbar style="margin: 16px" :title="title"></sde-toolbar>
    <sde-toolbar style="margin: 16px" title="With actions">
      <sde-button icon>mdi-plus</sde-button>
      <sde-button>Action</sde-button>
    </sde-toolbar>
    <sde-toolbar style="margin: 16px" title="Flat" flat>
      <sde-button icon>mdi-plus</sde-button>
      <sde-button>Action</sde-button>
    </sde-toolbar>
    <sde-toolbar style="margin: 16px" title="Dense" dense>
      <sde-button icon>mdi-plus</sde-button>
      <sde-button>Action</sde-button>
    </sde-toolbar>
    <sde-toolbar style="margin: 16px" title="Colored" :color="color">
      <sde-button icon>mdi-plus</sde-button>
      <sde-button>Action</sde-button>
    </sde-toolbar>
    <sde-toolbar style="margin: 16px" title="Flat Colored" flat :color="color">
      <sde-button icon>mdi-plus</sde-button>
      <sde-button>Action</sde-button>
    </sde-toolbar>
  </div>
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
}))
