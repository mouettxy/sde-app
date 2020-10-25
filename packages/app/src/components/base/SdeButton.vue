<template lang="pug">
v-btn.sde-button.sde-button--hover(
  :type='type',
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

<script lang="ts">
import Colors from '@/mixins/colors'
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator'

@Component
export default class SdeButton extends Mixins(Colors) {
  @Prop({ type: String, default: 'black' }) color!: string
  @Prop({ type: Boolean, default: false }) icon!: boolean
  @Prop({ type: String }) to!: string
  @Prop({ type: String, default: 'button' }) type!: string
  @Prop({ type: Boolean, default: false }) text!: boolean
  @Prop({ type: String }) prependIcon!: string
  @Prop({ type: String }) appendIcon!: string

  onClick(evt: any) {
    this.$emit('click', evt)
  }
}
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
