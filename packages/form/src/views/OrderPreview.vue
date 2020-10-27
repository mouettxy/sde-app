<template lang="pug">
v-card.order-preview(:class='{ mobile: isMobile }')
  v-card-title
    .order-preview__header
      v-btn(
        @click='closePreview',
        size='60px',
        icon
      )
        v-icon mdi-arrow-left
      span Оформление заявки
  v-card-text.order-preview__main
    v-card.order-preview__main-wrap.elevation-3
      v-timeline(dense)
        v-timeline-item.order-preview__buttons(icon='mdi-check')
          v-card.pa-2
            v-btn.my-2(
              :disabled='isOrderSending',
              @click='sendOrder',
              color='primary',
              block
            ) {{ $t("orderPreview.sendOrder") }}
            add-order-dialog(@save-start='closePreview')
              template(#buttons='{open}')
                v-btn(
                  @click='open',
                  color='primary',
                  block
                ) {{ $t("orderField.btn") }}
        v-timeline-item.order-preview__client(icon='mdi-account')
          v-card
            v-card-title.secondary.send-order__client-header.text-wrap
              template(v-if='isNewClient')
                span {{ $t("orderPreview.newClientDisclaimer") }}
              template(v-if='user && !isNewClient')
                v-icon(color='#181818') mdi-account
                span {{ user.CLIENT }} {{ user.customer_name }}
        v-timeline-item.send-order__address(
          v-for='address in addresses',
          :key='address.id',
          small,
          icon='mdi-map-marker',
          fill-dot
        )
          address-preview(:address='address')
        v-timeline-item.send-order__info(
          v-if='addresses',
          small,
          icon='mdi-information',
          fill-dot
        )
          address-info-preview(:info='information')
        v-timeline-item.send-order__price(icon='mdi-cash-marker')
          address-prices-preview(
            :user='user',
            :routes='routes',
            :prices='prices',
            :info='information'
          )
        v-timeline-item.order-preview__buttons(icon='mdi-check')
          v-card.pa-2
            v-btn.my-2(
              :disabled='isOrderSending',
              @click='sendOrder',
              color='primary',
              block
            ) {{ $t("orderPreview.sendOrder") }}
            add-order-dialog(@save-start='closePreview')
              template(#buttons='{open}')
                v-btn(
                  @click='open',
                  color='primary',
                  block
                ) {{ $t("orderField.btn") }}
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins/'
import { addressesModule, authModule } from '@/store'
import { cloneDeep } from 'lodash'

import AddOrderDialog from '@/components/dialogs/AddOrderDialog.vue'
import AddressInfoPreview from '@/components/order-preview/AddressInfoPreview.vue'
import AddressPreview from '@/components/order-preview/AddressPreview.vue'
import AddressPricesPreview from '@/components/order-preview/AddressPricesPreview.vue'

@Component({
  components: {
    AddOrderDialog,
    AddressInfoPreview,
    AddressPreview,
    AddressPricesPreview,
  },
})
export default class OrderPreview extends Mixins(colors, breakpoints) {
  public isOrderSending = false

  get information() {
    return cloneDeep(addressesModule.information)
  }

  get addresses() {
    return cloneDeep(addressesModule.addresses)
  }

  get prices() {
    return cloneDeep(addressesModule.prices)
  }

  get routes() {
    return cloneDeep(addressesModule.routes)
  }

  get user() {
    return cloneDeep(authModule.user)
  }

  get isNewClient() {
    return typeof authModule.user === 'string'
  }

  closePreview() {
    this.$emit('back')
  }

  async sendOrder() {
    this.isOrderSending = true
    this.$notification.warning('Идёт обработка запроса...')
    this.closePreview()
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
.order-preview
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

  .order-preview__main
    padding: 8px
</style>
