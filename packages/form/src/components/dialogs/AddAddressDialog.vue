<template lang="pug">
.add-address-dialog
  v-dialog(
    v-model='value',
    :fullscreen='isMobile',
    transition='dialog-bottom-transition',
    max-width='50%'
  )
    v-card
      v-card-title
        span {{ $t("addressField.header") }}
        v-spacer
        v-btn(
          @click='value = false',
          icon
        )
          v-icon mdi-close
      v-card-text
        address-field(@selected='closeDialog')
  slot(
    name='button',
    :open='openDialog'
  )
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'

import AddressField from '@/components/AddressField.vue'
import { breakpoints } from '@/mixins'

@Component({
  components: {
    AddressField,
  },
})
export default class AddAddressDialog extends Mixins(breakpoints) {
  public value = false

  openDialog() {
    this.value = true
  }

  closeDialog() {
    this.value = false
  }
}
</script>

<style lang="sass"></style>
