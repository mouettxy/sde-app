<template lang="pug">
v-checkbox.ma-0.pa-0(
  v-model='model',
  :label='label',
  @change='onChange',
  hide-details,
  dense,
  color='dark'
)
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class TableCheckbox extends Vue {
  @Prop({ type: Boolean }) value!: boolean
  @Prop({ type: String }) label!: string

  public model = false

  @Watch('value')
  onInitialValueChange(value: boolean) {
    this.model = value
  }

  @Emit('change')
  onChange() {
    return this.model
  }

  mounted() {
    this.model = this.value
  }
}
</script>

<style lang="sass"></style>
