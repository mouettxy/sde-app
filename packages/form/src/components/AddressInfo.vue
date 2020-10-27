<template lang="pug">
v-slide-y-transition
  v-card.address-info.elevation-3(v-if='addresses.length')
    v-form(v-model='valid')
      v-row
        v-col(cols='12')
          v-textarea(
            v-model='info.comment',
            @focus='onFieldFocus',
            :color='defaultInputColor',
            :label='$t("addressInfo.commentLabel")',
            :hint='$t("addressInfo.commentHint")',
            prepend-inner-icon='mdi-comment-edit',
            rows='2'
          )
        v-col(cols='12', lg='6', md='6')
          v-switch(
            v-model='info.quick',
            :color='defaultInputColor',
            :label='$t("addressInfo.quickLabelText") + $t("addressInfo.quickLabelPrice")'
          )
            template(#label, v-if='!isMobile')
              | {{$t("addressInfo.quickLabelText")}}
              br
              | {{$t("addressInfo.quickLabelPrice")}}
        v-col(cols='12', lg='6', md='6')
          v-switch(
            v-model='info.car',
            :color='defaultInputColor',
            :label='$t("addressInfo.carLabelText") + $t("addressInfo.carLabelPrice")'
          )
            template(#label, v-if='!isMobile')
              | {{$t("addressInfo.carLabelText")}}
              br
              | {{$t("addressInfo.carLabelPrice")}}
        v-col(cols='12', lg='6', md='6')
          v-radio-group(v-model='info.whoPays', :color='defaultInputColor')
            template(#label) {{$t("addressInfo.whoPaysTitle")}}
            v-radio(
              :color='defaultInputColor',
              :label='$t("addressInfo.whoPays1")',
              value='Из выручки',
              :disabled='!isBuyoutExists'
            )
            v-radio(:color='defaultInputColor', :label='$t("addressInfo.whoPays2")', value='Отправитель')
            v-radio(:color='defaultInputColor', :label='$t("addressInfo.whoPays3")', value='Получатель')
            v-radio(:color='defaultInputColor', :label='$t("addressInfo.whoPays4")', value='Заказчик')
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
    whoPays: 'Заказчик'
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
        if (user.payment_who) {
          this.info.whoPays = user.payment_who
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
