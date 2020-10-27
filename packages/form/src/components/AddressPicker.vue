<template lang="pug">
v-card.elevation-3.address-picker(v-if='user')
  v-slide-y-transition
    .address-picer__first-address(v-if='addressList.length === 0')
      h4.my-4.text-center {{ $t("seemsEmpty") }}

  draggable.address-list.py-8(
    v-if='addressList.length > 0',
    v-model='addressList',
    @start='drag = true',
    @end='drag = false',
    v-bind='dragOptions'
  )
    transition-group(type='transition', :name='!drag ? "slide-fade" : null')
      .address.elevation-1(v-for='address in addressList', :key='address.id')
        keep-alive
          address-fields(:address='address')
            template(#buttons='{remove}')
              v-row.text-center
                v-col
                  add-alias-dialog(:alias='address', v-if='!address.isAlias')
                    template(#button='{open}')
                      v-btn(@click='open', color='success', text, :content='$t("aliasField.tip")', v-tippy)
                        v-icon(left) mdi-bookmark-plus
                        | {{$t("aliasField.btn")}}
                v-col
                  v-btn(@click='remove', color='error', text, :content='$t("addressFields.removeTip")', v-tippy)
                    v-icon(left) mdi-trash-can
                    | {{$t("addressFields.removeBtn")}}
            template(#default='{on, show}')
              template(v-if='isMobile')
                span.address-header__buttons
                  v-btn#tour-address-move.address-move(icon)
                    v-icon(size='2rem') mdi-cursor-move
                  v-btn#tour-address-settings.address-settings-btn(@click='on', icon)
                    template(v-if='show')
                      v-icon(size='2rem') mdi-close
                    template(v-else)
                      v-icon(size='2rem') mdi-cog
                span {{address.address}}
              template(v-else)
                .address-move
                  v-btn(icon)#tour-address-move
                    v-icon mdi-cursor-move
                span.address-name {{address.address}}
                v-btn#tour-address-settings.address-settings-btn(@click='on', icon)
                  template(v-if='show')
                    v-icon mdi-close
                  template(v-else)
                    v-icon mdi-cog
  add-address-dialog
    template(#button='{open}')
      #tour-add-address.add-address
        v-btn(@click='open', :color='defaultAddAddressColor', text)
          v-icon(left, :color='defaultAddAddressColor') mdi-plus
          | {{ $t("addressField.btn") }}
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { breakpoints, colors } from '@/mixins'

import AddAliasDialog from '@/components/dialogs/AddAliasDialog.vue'
import AddAddressDialog from '@/components/dialogs/AddAddressDialog.vue'
import AddressFields from '@/components/AddressFields.vue'
import draggable from 'vuedraggable'

import { addressesModule, authModule } from '@/store'

@Component({
  components: {
    AddAliasDialog,
    AddAddressDialog,
    draggable,
    AddressFields
  }
})
export default class AddressPicker extends Mixins(breakpoints, colors) {
  public drag = false

  get dragOptions() {
    return {
      animation: 200,
      handle: '.address-move',
      group: 'description',
      disabled: false,
      ghostClass: 'ghost',
      forceFallback: true
    }
  }

  get addressList() {
    return addressesModule.addressList
  }

  set addressList(val) {
    addressesModule.updateList(val)
  }

  get user() {
    return authModule.user
  }
}
</script>

<style lang="sass">
.slide-fade-enter-active
  transition: all .3s ease

.slide-fade-leave-active
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0)

.slide-fade-enter, .slide-fade-leave-to
  transform: translateX(10px)
  opacity: 0


.address-picker
  margin-top: 12px
  padding: 12px

  .address
    margin-top: 12px

    .address-fields

      .address-header

        &.desktop
          padding: 8px
          display: flex
          flex-direction: row
          justify-content: space-between
          align-content: center

        &.mobile
          display: flex
          flex-direction: row
          align-items: center

          .address-header__buttons
            display: flex
            flex-direction: column
            padding: 2px
            margin-right: 8px

          span
            font-size: 1.1rem
            padding: 4px

    &:first-child
      margin-top: 0

    .address-name
      width: 100%
      font-size: 18px
      margin-top: 4px
</style>
