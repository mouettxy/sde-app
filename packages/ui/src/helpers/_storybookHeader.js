import vuetify from '@/plugins/vuetify'
import { storiesOf } from '@storybook/vue'
import { withKnobs } from '@storybook/addon-knobs'

export function generateStorybookHeader(name, type) {
  const storybook = storiesOf(name, module)
  let template
  if (type === 'inner') {
    template = '<v-app><v-main><v-container fluid><story/></v-container></v-main></v-app>'
  } else {
    template = '<v-app><story/></v-app>'
  }

  storybook.addDecorator(withKnobs({}))

  storybook.addDecorator(() => ({
    vuetify,
    template: '<v-app><story/></v-app>',
  }))

  return storybook
}
