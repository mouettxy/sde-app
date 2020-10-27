<template lang="pug">
v-alert.elevation-2.base__alert(
  v-if='!isHidden',
  :color='type',
  border='left',
  text,
  :dismissible='!persistent',
  :transition='transition'
)
  slot
  template(v-if='!persistent', v-slot:close='{toggle}')
    v-btn(@click='closeAlert(toggle)', icon)
      v-icon(:color='type') mdi-close
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class BaseAlert extends Vue {
  @Prop({ default: 'info' }) type?: string
  @Prop({ default: false }) persistent?: boolean
  @Prop({ required: true }) uniqueId!: string
  @Prop({ default: 'slide-y-trasition' }) transition?: string

  closeAlert(toggle: Function): void {
    const uniqueId = this.$props.uniqueId
    if (!this.$props.persistent && uniqueId) {
      let alerts = this.$cookies.get('closed-alerts')
      if (!alerts) {
        alerts = {}
      }
      alerts[uniqueId] = true
      this.$cookies.set('closed-alerts', alerts, 24 * 60 * 60 * 7, '/')
    }
    toggle()
  }

  get isHidden() {
    if (!this.$props.persistent) {
      const alerts = this.$cookies.get('closed-alerts')
      if (alerts && alerts[this.$props.uniqueId]) {
        return true
      }
    }

    return false
  }
}
</script>

<style lang="sass" scoped></style>
