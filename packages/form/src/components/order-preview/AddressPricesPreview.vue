<template lang="pug">
v-card
  v-card-title.secondary
    v-icon(size='1.4rem', color='#181818') mdi-cash-marker
    span {{$t("pricesPreview.title")}}
  v-card-text(v-if='routes')
    v-container(fluid).send-order__price-table
      v-row(v-if='routes').send-order__price-payed-row
        v-col(cols='6') {{$t("pricesPreview.distance")}} ({{routes.overallDistance}} {{$t("pricesPreview.distanceMeasure")}}.)
        v-col(cols='6')
          span +{{ roundVal(prices.routes.price) }}
          v-icon(size='1rem') mdi-currency-rub
      v-row(v-if='prices.addresses.additionals.price').send-order__price-payed-row
        v-col(cols='6') {{$t("pricesPreview.additionals")}}
        v-col(cols='6')
          span +{{ prices.addresses.additionals.price }}
          v-icon(size='1rem') mdi-currency-rub
      v-row(v-if='prices.addresses.buyInBuyOut').send-order__price-payed-row
        v-col(cols='6') {{$t("pricesPreview.buyInBuyOut")}}
        v-col(cols='6')
          span +{{ prices.addresses.buyInBuyOut }}
          v-icon(size='1rem') mdi-currency-rub
      v-row(v-if='prices.addresses.bundles').send-order__price-payed-row
        v-col(cols='6') {{$t("pricesPreview.bundles")}}
        v-col(cols='6')
          span +{{ prices.addresses.bundles }}
          v-icon(size='1rem') mdi-currency-rub
      v-row(v-if='info.quick').send-order__price-payed-row
        v-col(cols='6') {{$t("pricesPreview.quick")}}
        v-col(cols='6')
          span +20%
      v-row(v-if='info.car').send-order__price-payed-row
        v-col(cols='6') {{$t("pricesPreview.car")}}
        v-col(cols='6')
          span +15%
      template(v-if='prices.addresses')
        v-row(v-if='prices.addresses.additionals.entries > 5').send-order__price-discount-row
          v-col(cols='6') {{$t("pricesPreview.additionalsCount")}}
          v-col(cols='6')
            span -5%
      template(v-if='typeof user !== "string" && user')
        v-row(v-if='user.discount').send-order__price-discount-row
          v-col(cols='6') {{$t("pricesPreview.discount")}}
          v-col(cols='6')
            span -{{ user.discount }}%
      v-row(v-if='prices.overall').send-order__price-final-row.success
        v-col(cols='6') {{$t("pricesPreview.total")}}
        v-col(cols='6')
          span(:class='prices.discounted !== prices.overall ? "send-order__line-through" : ""') +{{ prices.overall }}
          v-icon(size='1rem') mdi-currency-rub
      v-row(v-if='prices.discounted !== prices.overall').send-order__price-final-row.success
        v-col(cols='6') {{$t("pricesPreview.discounted")}}
        v-col(cols='6')
          span +{{ prices.discounted }}
          v-icon(size='1rem') mdi-currency-rub
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { OrderPrices, OrderInformation, OrderRoute } from '@/typings/order'
import { round } from 'lodash'
import { User } from '@/store/auth'

@Component
export default class AddressPricesPreview extends Vue {
  @Prop({ required: true }) prices?: OrderPrices
  @Prop({ required: true }) info?: OrderInformation
  @Prop({ required: true }) routes?: OrderRoute
  @Prop({ required: true }) user?: User | string | null

  roundVal(val: number) {
    return round(val)
  }
}
</script>
