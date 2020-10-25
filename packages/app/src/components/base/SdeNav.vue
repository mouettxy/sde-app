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

<script lang="ts">
import Colors from '@/mixins/colors'
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator'

@Component
export default class SdeNav extends Mixins(Colors) {
  @Prop({ type: String, default: 'primary' }) color!: string
  @Prop({ type: String, default: 'sde' }) title!: string
  @Prop({ type: Boolean, default: false }) flat!: string
  @Prop({ type: Boolean, default: true }) menu!: string
  @Prop({ type: String, default: 'mdi-menu' }) menuIcon!: string

  onMenuClick(evt: any) {
    this.$emit('click-menu', evt)
  }
}
</script>
