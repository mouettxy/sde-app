import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import {
  AddressFields,
  OrderAddress as Address,
  OrderInformation as Information,
  OrderPrices as Prices,
  OrderRoute,
  OrderRoute as Route
} from '@/typings/order'
import {
  filter as lodashFilter,
  isUndefined,
  each as lodashEach,
  isNull,
  each,
  findLastIndex,
  cloneDeep,
  map
} from 'lodash'
import { authModule } from '.'
import { formatData, formatPhoneNumber } from '@/helpers'
import { sendOrder as apiSendOrder, saveOrder as apiSaveOrder } from '@/api'
import { User } from './auth'
import Vue from 'vue'
import i18n from '@/i18n'

@Module({
  name: 'addresses',
  namespaced: true
})
export default class Addresses extends VuexModule {
  public addresses: Address[] = []
  public information: Information | null = null
  public prices: Prices | null = null
  public routes: Route | null = null

  get isAddressesReachLimit() {
    if (this.addresses.length > 5) {
      return true
    }

    return false
  }

  get addressList() {
    return this.addresses
  }

  @Mutation
  RESET_STATE() {
    this.addresses = []
    this.information = null
    this.prices = null
    this.routes = null
  }

  @Mutation
  ADD_ADDRESS(payload: Address) {
    if (payload.name === 'От нас / К нам') {
      let phoneNumber
      if (typeof authModule.user !== 'string' && !isNull(authModule.user)) {
        if (authModule.user.customer_phone) {
          phoneNumber = formatPhoneNumber(authModule.user.customer_phone)
        }
      }

      payload.fields = {
        bundles: payload.fields?.bundles || 0,
        bus: payload.fields?.bus || false,
        buyin: payload.fields?.buyin || 0,
        buyout: payload.fields?.buyout || 0,
        comment:
          typeof authModule.user !== 'string' && !isNull(authModule.user)
            ? authModule.user.customer_adress_comment
            : '',
        datetime: '',
        phone: phoneNumber ? phoneNumber : '',
        takeIn: false,
        takeOut: false
      }

      payload.isAlias = true
    }

    this.addresses ? this.addresses.push(payload) : (this.addresses = [payload])

    let id = 1
    lodashEach(this.addresses, (address) => {
      address.id = id
      id++
    })

    if (typeof authModule.user !== 'string' && !isNull(authModule.user)) {
      const alwaysIn = authModule.user.always_in === '1'
      const alwaysOut = authModule.user.always_out === '1'
      if (alwaysIn || alwaysOut) {
        each(this.addresses, (e, i) => {
          if (!e.fields) {
            e.fields = {
              phone: '',
              datetime: '',
              bundles: 0,
              comment: '',
              buyin: 0,
              buyout: 0,
              takeIn: false,
              takeOut: false,
              bus: false
            }
          }
          if (i === 0 && alwaysOut) {
            e.fields.takeIn = false
            e.fields.takeOut = true
          } else if (i === findLastIndex(this.addresses) && alwaysIn) {
            e.fields.takeIn = true
            e.fields.takeOut = false
          } else if (alwaysIn) {
            e.fields.takeIn = true
            e.fields.takeOut = false
          }
        })
      }
    }
  }

  @Mutation
  ADD_ORDER(payload: any) {
    this.addresses = payload.addressList
    this.information = payload.addressInfo
    this.routes = payload.route
  }

  @Mutation
  REMOVE_ADDRESS(payload: number) {
    this.addresses = lodashFilter(this.addresses, (e: Address): boolean => {
      return e.id !== payload
    }) as Address[]

    if (!isUndefined(this.addresses) && !this.addresses.length) {
      this.addresses = []
    }
  }

  @Mutation
  UPDATE_ADDRESSES(payload: [Address]) {
    this.addresses = payload
  }

  @Mutation
  UPDATE_FIELDS(payload: { id: number; fields: AddressFields }) {
    lodashFilter(this.addresses, { id: payload.id })[0].fields = payload.fields
  }

  @Mutation
  UPDATE_LIST(payload: Address[]) {
    this.addresses = payload
  }

  @Mutation
  UPDATE_ROUTES(payload: OrderRoute | null) {
    this.routes = payload
  }

  @Mutation
  UPDATE_INFO(payload: Information) {
    this.information = payload
  }

  @Mutation
  UPDATE_PRICES(payload: Prices) {
    this.prices = payload
  }

  @Mutation
  SET_IS_ALIAS(payload: number) {
    const address = lodashFilter(this.addresses, { id: payload })[0]
    address.isAlias = true
  }

  @Action
  async reset(notRestoreUserFields?: boolean) {
    this.context.commit('RESET_STATE')

    if (!notRestoreUserFields) {
      if (await authModule.relog({ type: 'default', id: Vue.prototype.$cookies.get('remembered-id') })) {
        if (Vue.prototype.$cookies.get('fill-default-address') && Vue.prototype.$cookies.get('remembered-id')) {
          if (this.addresses.length <= 0) {
            const defaultAddress = lodashFilter(authModule.aliases, { name: 'От нас / К нам' })[0] as Address
            this.context.dispatch('add', defaultAddress)
          }
        }

        if (authModule.user) {
          const user = authModule.user
          if (typeof user !== 'string') {
            if (user.payment_who) {
              this.context.commit('UPDATE_INFO', {
                whoPays: user.payment_who,
                car: false,
                comment: '',
                quick: false
              })
            }
          }
        }
      }
    }

    if (isNull(this.information)) {
      this.context.commit('UPDATE_INFO', {
        whoPays: 'Заказчик',
        car: false,
        comment: '',
        quick: false
      })
    }
  }

  @Action
  updateList(payload: Address[]) {
    this.context.commit('UPDATE_LIST', payload)
  }

  @Action
  async add(payload?: Address) {
    if (payload) {
      if (!this.isAddressesReachLimit) {
        this.context.commit('ADD_ADDRESS', payload)
        return Promise.resolve(true)
      }
    }

    return Promise.resolve(false)
  }

  @Action
  async addOrder(payload: any) {
    this.context.commit('ADD_ORDER', payload)
    return Promise.resolve(true)
  }

  @Action
  async updateFields(payload: { id: number; fields: AddressFields }) {
    this.context.commit('UPDATE_FIELDS', payload)
    return Promise.resolve(true)
  }

  @Action
  async updateInfo(payload: Information) {
    this.context.commit('UPDATE_INFO', payload)
    return Promise.resolve(true)
  }

  @Action
  async setPrices(payload: Prices) {
    this.context.commit('UPDATE_PRICES', payload)
    return Promise.resolve(true)
  }

  @Action
  async saveOrder(payload: string): Promise<{ status: string; message: string }> {
    try {
      const parsed = formatData(authModule.user, this.addresses, this.information, this.routes, this.prices)
      const state = {
        name: payload,
        addressList: map(this.addresses, (e) => {
          if (e.name) {
            return {
              address: e.address,
              fields: e.fields,
              isAlias: e.isAlias,
              id: e.id,
              lat: e.lat,
              lon: e.lon,
              name: e.name
            }
          } else {
            return {
              address: e.address,
              fields: e.fields,
              isAlias: e.isAlias,
              id: e.id,
              lat: e.lat,
              lon: e.lon
            }
          }
        }),
        addressInfo: cloneDeep(this.information),
        route: cloneDeep(this.routes)
      }

      const response = await apiSaveOrder(state, (authModule.user as User).CLIENT)

      if (response) {
        const send = await apiSendOrder(parsed.raw, parsed.processed, parsed.modern)
        await this.context.dispatch('reset')
        return Promise.resolve({
          status: 'OK-SAVED',
          message: `${i18n.t('notifications.orderSuccessSaveSent')} ${send}`
        })
      } else {
        return Promise.resolve({ status: 'ERROR-SAVED', message: i18n.t('notifications.orderErrorSave') as string })
      }
    } catch (e) {
      return Promise.resolve({ status: 'ERROR-SAVED', message: i18n.t('notifications.orderErrorData') as string })
    }
  }

  @Action
  async sendOrder(): Promise<{ status: string; message: string }> {
    try {
      const parsed = formatData(authModule.user, this.addresses, this.information, this.routes, this.prices)
      try {
        const response = await apiSendOrder(parsed.raw, parsed.processed, parsed.modern)
        if (response) {
          this.context.dispatch('reset')
          return Promise.resolve({
            status: 'OK',
            message: `${i18n.t('notifications.orderSuccessSent')} ${response}`
          })
        } else {
          return Promise.resolve({ status: 'ERROR', message: i18n.t('notifications.orderErrorServer') as string })
        }
      } catch (e) {
        return Promise.resolve({ status: 'ERROR', message: i18n.t('notifications.orderErrorServer') as string })
      }
    } catch (e) {
      return Promise.resolve({ status: 'ERROR', message: i18n.t('notifications.orderErrorData') as string })
    }
  }
}
