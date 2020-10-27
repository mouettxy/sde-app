<template lang="pug">
.address-fields
  .address-header.primary(:class='{"mobile": isMobile, "desktop": !isMobile}', ref='header')
    slot(:on='showFields', :show='show')

  v-slide-y-transition(mode='in-out')
    .address-main.pa-4(v-show='show')
      .address-main-buttons
        slot(name='buttons', :remove='removeAddress')
      v-form(v-model='valid')
        v-row
          v-col(cols='12', lg='6', md='6')
            v-text-field(
              ref='phoneField',
              v-model='fields.phone',
              @focus='onFieldFocus',
              :color='defaultInputColor',
              :label='$t("addressFields.phoneLabel")',
              :hint='$t("addressFields.phoneHint")',
              v-mask='\'+7 (###) ###-##-##\'',
              prepend-inner-icon='mdi-phone',
              clearable
            )
          v-col(cols='12', lg='6', md='6')
            v-datetime-picker(
              v-model='date',
              @input='onDateChange',
              @reset='onDateReset',
              :label='$t("addressFields.datetimeLabel")',
              :textFieldProps='{ "prepend-inner-icon": "mdi-calendar-clock", color: defaultInputColor, "v-model": fields.datetime }',
              :datePickerProps='{ locale: `${$i18n.locale}-${$i18n.locale}`, "header-color": "accent" }',
              :timePickerProps='{ format: "24hr", "header-color": "accent" }',
              :clearText='$t("addressFields.datetimeClear")',
              :okText='$t("addressFields.datetimeApply")',
              dateFormat='dd.MM.yyyy',
              timeFormat='HH:mm'
            )
              template(slot='dateIcon')
                v-icon mdi-calendar
              template(slot='timeIcon')
                v-icon mdi-clock
        v-row
          v-col(cols='12', lg='4', md='4')
            v-text-field(
              v-model.number='fields.buyout',
              @focus='onFieldFocus',
              :disabled="isBuyoutDisabled"
              :color='defaultInputColor',
              :label='$t("addressFields.buyoutLabel")',
              prepend-inner-icon='mdi-tray-minus',
              type='number'
            )
          v-col(cols='12', lg='4', md='4')
            v-text-field(
              v-model.number='fields.buyin',
              @focus='onFieldFocus',
              :color='defaultInputColor',
              :label='$t("addressFields.buyinLabel")',
              prepend-inner-icon='mdi-tray-plus',
              type='number'
            )
          v-col(cols='12', lg='4', md='4')
            v-text-field(
              v-model.number='fields.bundles',
              @focus='onFieldFocus',
              :color='defaultInputColor',
              :label='$t("addressFields.bundlesLabel")',
              :hint='$t("addressFields.bundlesHint")',
              prepend-inner-icon='mdi-package-variant',
              type='number'
            )
          v-col(cols='12')
            v-textarea(
              v-model='fields.comment',
              @focus='onFieldFocus',
              :color='defaultInputColor',
              :label='$t("addressFields.commentLabel")',
              :hint='$t("addressFields.commentHint")',
              prepend-inner-icon='mdi-comment-edit',
              rows='2'
            )
        v-row
          v-col(cols='6')
            v-switch(:color='defaultInputColor', v-model='fields.takeIn', :label='$t("addressFields.takeInLabel")')
          v-col(cols='6')
            v-switch(
              :color='defaultInputColor',
              v-model='fields.takeOut',
              :disabled='isLastAddress',
              :label='$t("addressFields.takeOutLabel")'
            )
          v-col(cols='12')
            v-switch(:color='defaultInputColor', v-model='fields.bus', :label='$t("addressFields.busLabel")')
      v-btn(block, text, @click='showFields')
        v-icon mdi-arrow-up-drop-circle-outline
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch, Ref } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins'
import { AddressFields as TAddressFields, OrderAddress } from '@/typings/order'
import moment from 'moment'
import { findIndex, findLastIndex, size, debounce, last, isEqual } from 'lodash'

import { addressesModule, authModule } from '@/store'

import VDatetimePicker from '@/components/third-party/DatetimePicker.vue'

@Component({
  components: {
    VDatetimePicker
  }
})
export default class AddressFields extends Mixins(colors, breakpoints) {
  @Ref('header') header: any
  @Ref('phoneField') phoneField: any
  @Prop(Object) address!: OrderAddress
  private debounced: any = debounce(addressesModule.updateFields, 500)
  public show = false
  public date = ''
  public isManuallyModified = false
  public valid = true
  public fields: TAddressFields = {
    bundles: 0,
    bus: false,
    buyin: 0,
    buyout: 0,
    comment: '',
    datetime: '',
    phone: '',
    takeIn: false,
    takeOut: false
  }

  @Watch('fields', { deep: true })
  onFieldsChange(val: TAddressFields) {
    this.debounced({ id: this.address.id, fields: val })
  }

  get addressList() {
    return addressesModule.addressList
  }

  get isLastAddress() {
    return isEqual(this.address, last(this.addressList))
  }

  get isBuyoutDisabled() {
    if (authModule.isNewUser) {
      return false
    }

    if (!authModule.user || typeof authModule.user === 'string') {
      return false
    }

    if (authModule.user.region === 'Краснодар' || authModule.user.region === 'Севастополь') {
      return false
    }

    return true
  }

  getTimeOffset() {
    const index = findIndex(this.addressList, { id: this.address.id })
    const lastIndex = findLastIndex(this.addressList)
    const size_ = size(this.addressList)

    if (size_ === 1 || index === 0) {
      return 20
    }

    if (size_ === 2 && index === 1) {
      return 20 + 35
    }

    if (index === lastIndex) {
      return 20 + 35 + (size_ - 2) * 25
    }

    return 20 + index * 25
  }

  updateTimeField() {
    const m = moment()
      .locale('ru')
      .add(this.getTimeOffset(), 'm')
    this.date = `${m.format('L')} ${m.format('LT')}`
    this.fields.datetime = `${m.format('L')} ${m.format('LT')}`
    return `${m.format('L')} ${m.format('LT')}`
  }

  onDateChange() {
    this.isManuallyModified = true
    const m = moment(this.date).locale('ru')
    const dateTime = `${m.format('L')} ${m.format('LT')}`
    if (dateTime) {
      this.fields.datetime = dateTime
    }
    this.debounced({ id: this.address.id, fields: this.fields })
  }

  onDateReset() {
    this.isManuallyModified = false
    this.updateTimeField()
  }

  showFields() {
    if (this.show) {
      this.show = false
      this.header.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    } else {
      this.show = true
      setTimeout(() => {
        this.phoneField.$el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }, 100)
    }
  }

  removeAddress() {
    addressesModule.REMOVE_ADDRESS(this.address.id)
  }

  onFieldFocus(event: FocusEvent) {
    const el = event.target as HTMLElement

    if (el) {
      if (this.isMobile) {
        const pos = el.style.position
        const top = (el.style.position = 'relative')
        el.style.top = '-25px'
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        el.style.top = top
        el.style.position = pos
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  mounted() {
    if (this.address.fields) {
      this.fields = this.address.fields
    }

    this.updateTimeField()

    setInterval(() => {
      if (!this.isManuallyModified) {
        this.updateTimeField()
      }
    }, 1000)
  }
}
</script>

<style lang="sass">
.address-fields
  .address-main
    .row
      .col-md-4, .col-lg-4, .col-12, .col, .col-6
        padding: 0
        padding-left: 12px
        padding-right: 12px
</style>
