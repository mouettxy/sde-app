<template lang="pug">
v-text-field.sde-input(
  v-model='model',
  :type='type',
  :prepend-inner-icon='icon',
  :label='label',
  :dense='dense',
  :color='color',
  :hint='hint',
  persistent-hint,
  hide-details='auto',
  clearable
)
</template>

<script lang="ts">
import Colors from '@/mixins/colors'
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator'

@Component
export default class SdeInput extends Mixins(Colors) {
  @Prop(String) value!: string
  @Prop({ type: String, default: 'text' }) type!: string
  @Prop({ type: Boolean, default: false }) dense!: string
  @Prop(String) label!: string
  @Prop(String) icon!: string
  @Prop(String) hint!: string
  @Prop({ type: String, default: '#151515' }) color!: string

  get model() {
    return this.value
  }

  set model(value: string) {
    this.$emit('input', value)
  }
}
</script>
