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

<script lang="ts">
import Colors from '@/mixins/colors'
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator'

@Component
export default class SdeNav extends Mixins(Colors) {
  @Prop({ type: Boolean, default: false }) flat!: string
  @Prop({ type: Boolean, default: false }) dense!: string
  @Prop(String) title!: string
  @Prop({ type: String, default: '#ffffff' }) color!: string
}
</script>
