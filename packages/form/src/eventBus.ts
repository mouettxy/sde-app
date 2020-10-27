import Vue from 'vue'
import { cloneDeep, each, findLastIndex, isUndefined, size as lodashSize } from 'lodash'
import moment from 'moment'
import i18n from './i18n'
import { OrderAddress } from './typings/order'

export const eventBus = new Vue({
  i18n,
  methods: {
    getAutoAddressDatetime(type: string, index = 0, addresses: OrderAddress[] | undefined = undefined) {
      const getTimeOffset = (index: number): number => {
        const lastIndex = findLastIndex(addresses)
        const size = lodashSize(addresses)

        if (size === 1 || index === 0) {
          return 20
        }

        if (size === 2 && index === 1) {
          return 20 + 35
        }

        if (index === lastIndex) {
          return 20 + 35 + (size - 2) * 25
        }

        return 20 + index * 25
      }

      if (type === 'all') {
        // * this because we get observable object from store and do not want to modify it
        addresses = cloneDeep(addresses)

        each(addresses, (e, index) => {
          const m = moment()
            .locale('ru')
            .add(getTimeOffset(index), 'm')

          e.fields.datetime = `${m.format('L')} ${m.format('LT')}`
        })

        return addresses
      } else if (type === 'single') {
        addresses = cloneDeep(addresses)

        const m = moment()
          .locale('ru')
          .add(getTimeOffset(index), 'm')

        if (!isUndefined(addresses)) {
          addresses[index].fields.datetime = `${m.format('L')} ${m.format('LT')}`
          return addresses[index]
        }
        return ''
      }
    }
  }
})

export default eventBus
