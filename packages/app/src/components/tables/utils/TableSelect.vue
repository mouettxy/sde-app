<template lang="pug">
v-select(
  v-model='model',
  :items='items',
  single-line,
  hide-selected,
  hide-details,
  dense
)
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component
export default class TableSelect extends Vue {
  @Prop([String, Number]) value!: string
  @Prop(Array) items!: Array<any>

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
    this.$emit('change', value)
  }
}
</script>

<style lang="sass"></style>
