<template lang="pug">
v-slide-y-transition
  .address-buttons
    template(v-if='pricesOverall')
      v-btn#tour-preview-btn(
        :disabled='inTour() || isOrderSending',
        @click='$emit("preview")',
        color='primary',
        block
      ) {{ $t("orderButtons.preview") }}
      v-btn#tour-send-btn(
        :disabled='inTour() || isOrderSending',
        @click='sendOrder',
        color='primary',
        block
      ) {{ $t("orderButtons.send") }}
      add-order-dialog
        template(#buttons='{open}')
          v-btn#tour-save-btn(
            :disabled='inTour() || isOrderSending',
            @click='open',
            color='primary',
            block
          ) {{ $t("orderButtons.save") }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import AddOrderDialog from '@/components/dialogs/AddOrderDialog.vue'

import { addressesModule } from '@/store'
@Component({
  components: {
    AddOrderDialog,
  },
})
export default class AddressButtons extends Vue {
  public isOrderSending = false

  get pricesOverall() {
    if (addressesModule.prices) {
      return addressesModule.prices.overall > 0
    }

    return false
  }

  inTour() {
    return !!document.querySelector('.v-tour__target--highlighted')
  }

  async sendOrder() {
    this.isOrderSending = true
    this.$notification.warning('Идёт обработка запроса...')
    const response = await addressesModule.sendOrder()

    switch (response.status) {
      case 'ERROR':
        this.$notification.error(response.message)
        break
      case 'ERROR-SAVED':
        this.$notification.error(response.message)
        break
      case 'OK':
        this.$notification.success(response.message)
        break
      case 'OK-SAVED':
        this.$notification.success(response.message)
        break
    }
    this.isOrderSending = false
  }
}
</script>

<style lang="sass">
.address-buttons
  margin-top: 12px

  .v-btn
    margin-top: 6px
    &:first-child
      margin-top: 0
</style>
