<template lang="pug">
v-toolbar.sde-toolbar(
  :title='title',
  :flat='flat',
  :dense='dense',
  :color='color'
)
  template(v-if='title')
    v-toolbar-title(:style='{ color: getTextColor(color) }') {{ title }}
  v-spacer
  slot(name='default')
</template>

<script>
import { Colors } from '../../helpers'

export default {
  name: 'SdeToolbar',
  mixins: [Colors],
  props: {
    flat: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    title: String,
    color: {
      type: String,
      default: '#ffffff',
    },
  },
}
</script>
