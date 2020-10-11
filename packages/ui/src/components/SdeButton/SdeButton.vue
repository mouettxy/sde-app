<template lang="pug">
v-btn.sde-button.sde-button--hover(
  :to='to',
  :text='text',
  :style='{ color: icon ? iconColor(color) : textColor(color) }',
  :icon='icon',
  :color='color',
  @click='onClick'
)
  template(v-if='icon')
    v-icon
      slot(name='default')
  template(v-else)
    template(v-if='prependIcon')
      v-icon(left) {{ prependIcon }}
    slot(name='default')
    template(v-if='appendIcon')
      v-icon(right) {{ appendIcon }}
</template>

<script>
import { getTextColor, rgba2hex } from '../../helpers'
import { startsWith } from 'lodash'

export const SdeButton = {
  name: 'SdeButton',
  props: {
    color: {
      type: String,
      default: 'black',
    },
    icon: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
    },
    text: {
      type: Boolean,
      default: false,
    },
    prependIcon: {
      type: String,
    },
    appendIcon: {
      type: String,
    },
  },
  methods: {
    onClick(evt) {
      this.$emit('click', evt)
    },
    textColor(color) {
      if (color[0] !== '#') {
        const currentTheme = this.$vuetify.theme.themes[this.$vuetify.theme.isDark ? 'dark' : 'light']
        for (const key in currentTheme) {
          if (key === color) {
            return getTextColor(currentTheme[key])
          }
        }
      }

      if (startsWith(color, 'rgb')) {
        return getTextColor(rgba2hex(color))
      }

      return getTextColor(color)
    },
    iconColor(color) {
      if (startsWith(color, 'rgb')) {
        return rgba2hex(color)
      }

      return color
    },
  },
  mounted() {
    this.textColor('#333')
  },
}

export default SdeButton
</script>

<style lang="sass">
.sde-button
  &--hover
    &.theme--light
      transition: background-color .1s, color 3s, ease
      &:hover
        color: #fafafa !important
        background-color: #000 !important
</style>
