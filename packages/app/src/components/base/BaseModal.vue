<template lang="pug">
v-dialog(
  v-model='model',
  :fullscreen='this.$vuetify.breakpoint.mobile',
  :content-class='contentClass',
  width='50vw',
  transition='dialog-bottom-transition',
  persistent,
  overlay-opacity='0.8'
)
  template(#activator='{on, attrs}')
    slot(
      name='activator',
      :on='on',
      :attrs='attrs'
    )
  slot(:close='closeModal')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class BaseModal extends Vue {
  @Prop({ default: 'center-modal', type: String }) contentClass!: string
  @Prop({ required: true, type: Boolean }) value!: boolean

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }

  closeModal() {
    this.model = false
  }
}
</script>
