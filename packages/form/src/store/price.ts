// import _ from 'lodash'
import priceSettings from '@/prices.json'
import { Store } from 'vuex'
import { includes, debounce, each, isNull, isEmpty, size, template, isUndefined, round } from 'lodash'
import { authModule, addressesModule } from '@/store'
import { User } from '@/store/auth'
import { OrderAddress, OrderInformation, OrderRoute } from '@/typings/order'

class Price {
  private user: User | string | null
  private addresses: OrderAddress[]
  private information: OrderInformation | null
  private route: OrderRoute | null
  private settings: any

  constructor(priceSettings: any) {
    this.user = authModule.user
    this.addresses = addressesModule.addressList
    this.route = addressesModule.routes
    this.information = addressesModule.information
    this.settings = undefined

    each(priceSettings, (e, k) => {
      if (!(typeof this.user === 'string') && !isNull(this.user)) {
        if (k === this.user.region) {
          this.settings = e
        }
      }
    })

    if (!this.settings) {
      this.settings = priceSettings['default']
    }
  }

  addressesPrice() {
    if (!isEmpty(this.addresses)) {
      const additionals = this.additionals()

      return additionals
    }

    return {
      buyInBuyOut: 0,
      additionals: 0,
      bundles: 0,
      overall: 0
    }
  }

  additionals() {
    let freeExtraPoint
    if (!(typeof this.user === 'string') && !isNull(this.user) && this.user.free_extra_point === '1') {
      freeExtraPoint = true
    } else {
      freeExtraPoint = false
    }

    const bInOut = this.bInOut()
    const additionalsAddresses = this.additionalsAddresses()
    const bundles = this.bundles()

    let overall = bInOut + additionalsAddresses.price + bundles

    if (additionalsAddresses.entries >= this.settings.additionals.entries) {
      const discount = overall * (this.settings.additionals.entriesDiscount / 100)
      overall -= discount
    }

    if (size(this.addresses) > 2 && freeExtraPoint) {
      overall += (size(this.addresses) - 2) * this.settings.additionals.extraPoint
    }

    return {
      buyInBuyOut: bInOut,
      additionals: additionalsAddresses,
      bundles,
      overall
    }
  }

  bInOut() {
    let accumulate = 0

    let freePay: boolean
    if (!(typeof this.user === 'string') && !isNull(this.user) && this.user.free_pay === '1') {
      freePay = true
    } else {
      freePay = false
    }

    let freeCash: boolean
    if (!(typeof this.user === 'string') && !isNull(this.user) && this.user.free_cash === '1') {
      freeCash = true
    } else {
      freeCash = false
    }

    each(this.addresses, (e) => {
      if (e.fields?.buyin && !freePay) {
        accumulate += this.settings.additionals.buyin
      }
      if (e.fields?.buyout && !freeCash) {
        accumulate += this.settings.additionals.buyout
      }
    })

    return accumulate
  }

  additionalsAddresses() {
    let accumulate = 0
    let entries = 0

    let freeIn: boolean
    if (!(typeof this.user === 'string') && !isNull(this.user) && this.user.free_in === '1') {
      freeIn = true
    } else {
      freeIn = false
    }

    let freeOut: boolean
    if (!(typeof this.user === 'string') && !isNull(this.user) && this.user.free_out === '1') {
      freeOut = true
    } else {
      freeOut = false
    }

    each(this.addresses, (e) => {
      if (e.fields?.takeIn && !freeIn) {
        entries += 1
        accumulate += this.settings.additionals.takeIn
      }
      if (e.fields?.takeOut && !freeOut) {
        entries += 1
        accumulate += this.settings.additionals.takeOut
      }
      if (e.fields?.bus) {
        entries += 1
        accumulate += this.settings.additionals.bus
      }
    })

    return {
      price: accumulate,
      entries
    }
  }

  bundles() {
    let accumulate = 0

    each(this.addresses, (e) => {
      const bundles = e.fields?.bundles || 0
      accumulate += bundles * this.settings.additionals.bundle
    })

    return accumulate
  }

  /* -------------------------------------------------------------------------- */
  /*                                   ROUTES                                   */
  /* -------------------------------------------------------------------------- */

  routes() {
    if (this.route) {
      let rate: number
      if (!(typeof this.user === 'string') && !isNull(this.user) && this.user.free_out === '1') {
        rate = parseInt(this.user.Input)
      } else {
        rate = NaN
      }
      let price = this.mileage(this.route.overallDistance, rate)

      if (isNaN(price) || isNull(price) || isUndefined(price)) {
        price = 0
      }

      return { price }
    }

    return { price: 0 }
  }

  mileage(mileage: number, rate: number) {
    try {
      const isTrue = (expr: any) => {
        if (expr !== 'false') {
          return true
        }
        return false
      }

      let price

      each(this.settings.mileage, (e) => {
        const templatedExpression = template(e.expression)({ mileage, rate, client: this.user })
        const templatedPrice = template(e.price)({ mileage, rate, client: this.user })
        const templatedModifier = template(e.modifier)({ mileage, rate, client: this.user })

        if (isTrue(templatedExpression)) {
          if (isTrue(templatedModifier)) {
            price = parseInt(templatedPrice) * parseInt(templatedModifier)
            return false
          }

          price = parseInt(templatedPrice)
          return false
        }
      })

      if (price !== undefined) {
        return price
      } else {
        const tPriceFinally = template(this.settings.mileageFinally.price)({ mileage, rate, client: this.user })
        const tModifierFinally = template(this.settings.mileageFinally.modifier)({
          mileage,
          rate,
          client: this.user
        })

        return parseInt(tPriceFinally) * parseInt(tModifierFinally)
      }
    } catch (e) {
      return 0
    }
  }

  get() {
    const addresses = this.addressesPrice()
    const routes = this.routes()

    const priceList = { addresses, routes, additionals: 0, overall: 0, discounted: 0 }

    if (size(this.addresses) >= 2) {
      let accumulate = 0
      let discounted = 0

      if (priceList.addresses) {
        if (priceList.addresses.overall) {
          accumulate += priceList.addresses.overall
          priceList.additionals = priceList.addresses.overall
        } else {
          priceList.additionals = 0
        }
      }

      if (priceList.routes) {
        if (priceList.routes.price) {
          accumulate += priceList.routes.price
        }
      }

      if (this.information) {
        if (this.information.car) {
          const markup = accumulate * (this.settings.carMarkup / 100)
          accumulate += markup
        }

        if (this.information.quick) {
          const markup = accumulate * (this.settings.quickMarkup / 100)
          accumulate += markup
        }
      }

      if (!(typeof this.user === 'string') && !isNull(this.user) && this.user.discount) {
        const discount = parseInt(this.user.discount)
        if (!isNaN(discount)) {
          discounted = accumulate
          discounted -= (discounted / 100) * discount
        }
      }

      priceList.overall = round(accumulate)
      priceList.discounted = discounted ? round(discounted) : round(accumulate)
    } else {
      priceList.overall = 0
    }

    addressesModule.setPrices(priceList)
  }
}

export default (store: Store<any>) => {
  store.subscribe((mutation) => {
    const affectedMutations = [
      'addresses/RESET_STATE',
      'addresses/ADD_ADDRESS',
      'addresses/ADD_ORDER',
      'addresses/REMOVE_ADDRESS',
      'addresses/UPDATE_ADDRESSES',
      'addresses/UPDATE_FIELDS',
      'addresses/UPDATE_LIST',
      'addresses/UPDATE_ROUTES',
      'addresses/UPDATE_INFO'
    ]
    if (includes(affectedMutations, mutation.type)) {
      const price = new Price(priceSettings)

      const debounced = debounce(price.get.bind(price), 500)
      debounced()
    }
  })
}
