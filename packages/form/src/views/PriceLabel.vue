<template lang="pug">
.price-label.elevation-12(:class='{ desktop: isMobile, mobile: !isMobile }')
  animated-number.price.black--text(
    :value='pricesOverall',
    :formatValue='formatToPrice',
    :duration='800',
    :color='defaultInputColor',
    easing='easeInOutSine'
  )
  v-icon.black--text(size='2rem') mdi-currency-rub
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins'

import { addressesModule } from '@/store'
import AnimatedNumber from 'animated-number-vue'

@Component({
  components: {
    AnimatedNumber,
  },
})
export default class PriceLabel extends Mixins(colors, breakpoints) {
  get pricesOverall() {
    return addressesModule.prices?.discounted || undefined
  }

  formatToPrice(value: string | number) {
    return `${Number(value).toFixed(0)}`
  }
}
</script>

<style lang="sass" scoped>
.price-label
  z-index: 1000
  position: absolute
  top: 50%
  right: 0
  padding: 6px
  background: #ffcc01

  .price
    display: inline-block
    vertical-align: middle
    font-size: 1.5rem

  .mobile
    z-index: 1000
    position: absolute
    top: calc(100% - 120px)
    left: 0
    padding: 6px
    background: #ffcc01

    .price
      display: inline-block
      vertical-align: middle
      font-size: 1.5rem
</style>
