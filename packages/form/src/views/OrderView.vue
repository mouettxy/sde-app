<template lang="pug">
.order-view
  v-slide-x-transition(appear)
    template(v-show='state === "order"')
      .order-view__cards
        user-auth
        user-favorite
        address-picker
        address-info
        address-buttons(@preview='toPreview')
  v-slide-y-reverse-transition(
    mode='out-in',
    leave-absolute
  )
    template(v-if='state === "preview"')
      order-preview(@back='fromPreview')
  .vertical-spacer
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins'

import UserAuth from '@/components/UserAuth.vue'
import UserFavorite from '@/components/UserFavorite.vue'
import AddressPicker from '@/components/AddressPicker.vue'
import AddressInfo from '@/components/AddressInfo.vue'
import AddressButtons from '@/components/AddressButtons.vue'
import OrderPreview from '@/views/OrderPreview.vue'

import { authModule } from '@/store'
import eventBus from '@/eventBus'

@Component({
  components: {
    UserAuth,
    UserFavorite,
    AddressPicker,
    AddressInfo,
    AddressButtons,
    OrderPreview,
  },
})
export default class OrderView extends Mixins(colors, breakpoints) {
  @Prop(String) state?: string

  get isLoggedIn() {
    return authModule.isLoggedIn
  }

  fromPreview() {
    eventBus.$emit('change-order-view', 'order')
  }

  toPreview() {
    eventBus.$emit('change-order-view', 'preview')
  }
}
</script>

<style lang="sass">
.order-view
  position: relative
  padding: 12px
  overflow-y: scroll
  height: $height-mobile-sde

  .vertical-spacer
    height: 64px
</style>
