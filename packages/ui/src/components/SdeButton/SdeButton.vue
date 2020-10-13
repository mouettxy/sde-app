<template lang="pug">
v-btn.sde-button.sde-button--hover(
  :to='to',
  :text='text',
  :style='{ color: icon || text ? getIconColor(color) : getTextColor(color) }',
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
import { Colors } from '../../helpers'

export const SdeButton = {
  name: 'SdeButton',
  mixins: [Colors],
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
