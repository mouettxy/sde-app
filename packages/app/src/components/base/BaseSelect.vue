<template lang="pug">
v-select.base-select(
  v-model='model',
  :label='label',
  :items='items',
  hide-selected,
  hide-details
)
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BaseSelect extends Vue {
  @Prop({ type: [String, Number, Boolean], required: true }) value!: string | number | boolean
  @Prop({ type: String, required: true }) label!: string
  @Prop({ type: Array, required: true }) items!: Array<any>

  get model() {
    return this.value
  }

  set model(value: string | number | boolean) {
    this.$emit('input', value)
  }
}
</script>

<style lang="sass"></style>
