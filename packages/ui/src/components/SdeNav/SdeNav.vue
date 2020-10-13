<template lang="pug">
v-app-bar.sde-nav(
  :style='{ color: getTextColor(color) }',
  :flat='flat',
  :color='color',
  dense,
  clipped-left,
  app
)
  template(v-if='menu')
    sde-button(
      :color='getTextColor(color)',
      @click='onMenuClick',
      icon
    ) mdi-menu
  template(v-if='title')
    v-toolbar-title {{ title }}
  v-spacer
  slot(name='default')
</template>

<script>
import { Colors } from '../../helpers'

export default {
  name: 'SdeNav',
  mixins: [Colors],
  props: {
    color: {
      type: String,
      default: 'primary',
    },
    title: {
      type: String,
      default: 'sde',
    },
    flat: {
      type: Boolean,
      default: false,
    },
    menu: {
      type: Boolean,
      default: true,
    },
    menuIcon: {
      type: String,
      default: 'mdi-menu',
    },
  },
  methods: {
    onMenuClick(evt) {
      this.$emit('click-menu', evt)
    },
  },
}
</script>
