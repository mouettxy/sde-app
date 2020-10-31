<template lang="pug">
v-slide-y-transition
  v-card.address-info.elevation-3(v-if='addresses.length')
    v-form(v-model='valid')
      v-row
        v-col(cols='12')
          v-textarea(
            v-model='info.comment',
            :label='$t("addressInfo.commentLabel")',
            :color='defaultInputColor',
            :hint='$t("addressInfo.commentHint")',
            @focus='onFieldFocus',
            rows='2',
            prepend-inner-icon='mdi-comment-edit'
          )
        v-col(
          cols='12',
          md='6',
          lg='6'
        )
          v-switch(
            v-model='info.quick',
            :label='$t("addressInfo.quickLabelText") + $t("addressInfo.quickLabelPrice")',
            :color='defaultInputColor'
          )
            template(
              v-if='!isMobile',
              #label
            )
              | {{ $t("addressInfo.quickLabelText") }}
              br
              | {{ $t("addressInfo.quickLabelPrice") }}
        v-col(
          cols='12',
          md='6',
          lg='6'
        )
          v-switch(
            v-model='info.car',
            :label='$t("addressInfo.carLabelText")',
            :color='defaultInputColor'
          )
        v-col(
          cols='12',
          md='6',
          lg='6'
        )
          v-radio-group(
            v-model='info.whoPays',
            :color='defaultInputColor'
          )
            template(#label) {{ $t("addressInfo.whoPaysTitle") }}
            v-radio(
              :label='$t("addressInfo.whoPays1")',
              :disabled='!isBuyoutExists',
              :color='defaultInputColor',
              value='Из выручки'
            )
            v-radio(
              :label='$t("addressInfo.whoPays2")',
              :color='defaultInputColor',
              value='Отправитель'
            )
            v-radio(
              :label='$t("addressInfo.whoPays3")',
              :color='defaultInputColor',
              value='Получатель'
            )
            v-radio(
              :label='$t("addressInfo.whoPays4")',
              :color='defaultInputColor',
              value='Заказчик'
            )
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins'
import { reduce, debounce } from 'lodash'
import { authModule, addressesModule } from '@/store'
import { parse } from 'date-fns'

@Component
export default class AddressInfo extends Mixins(colors, breakpoints) {
  private debounced: any = debounce(addressesModule.updateInfo, 500)
  public valid = true
  public info: import('@/typings/order').OrderInformation = {
    car: false,
    comment: '',
    quick: false,
    whoPays: 'Заказчик',
  }

  @Watch('info', { deep: true, immediate: true })
  onInfoChange(val: import('@/typings/order').OrderInformation) {
    this.debounced(val)
  }

  @Watch('information', { deep: true })
  onInformationVuexChange(val: import('@/typings/order').OrderInformation) {
    this.info = val
  }

  get addresses() {
    return addressesModule.addresses
  }

  get information() {
    return addressesModule.information
  }

  get isBuyoutExists() {
    const buyout = reduce(this.addresses, (a, n) => (n.fields && n.fields.buyout > 0 ? a + n.fields.buyout : a + 0), 0)
    return buyout > 0
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

  created() {
    if (authModule.user) {
      const user = authModule.user
      if (typeof user !== 'string') {
        if (user.paymentWho) {
          this.info.whoPays = user.paymentWho
          this.debounced()
        }
      }
    }
  }
}
</script>

<style lang="sass">
.address-info
  margin-top: 12px
  padding: 24px

  .col-12
    padding: 0
</style>
