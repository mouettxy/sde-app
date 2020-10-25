<template lang="pug">
v-edit-dialog(
  :return-value.sync='model',
  @save='onChange'
) {{ model }}
  template(#input)
    v-text-field(
      v-model='model',
      single-line,
      label='Редактирование',
      counter
    )
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class TableEdit extends Vue {
  @Prop({ type: [String, Number] }) value!: string | number

  public model: string | number = ''

  @Watch('value')
  onInitialValueChange(value: string | number) {
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
