import { generateStorybookHeader } from '../../helpers/_storybookHeader'
import { color, text, array } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

const storybook = generateStorybookHeader('List', 'inner')

storybook.add('default', () => ({
  template: /* html */ `
    <sde-list>
      <sde-list-item title="With title"></sde-list-item>
      <sde-list-item title="With title" subtitle="With subtitle"></sde-list-item>
      <sde-list-item title="With title" subtitle="With subtitle" message="With message"></sde-list-item>
    </sde-list>
  `,
}))
