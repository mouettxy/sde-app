import { map } from 'lodash'
import { RegisterClientInput } from './../typings/client/index'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { TableHelpers } from '@/store/helpers'
import axios from '@/plugins/axios'
import { Client } from '@/typings/client'

@Module({
  namespaced: true,
  name: 'clients',
})
export default class Clients extends VuexModule {
  @Action
  async updateClient(payload: any) {
    this.context.commit('SET_LOADING', true)

    try {
      const response = await axios.put(`/client/${payload.id}`, payload.data)

      if (response.status === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    } finally {
      this.context.commit('SET_LOADING', false)
    }
  }

  @Action
  async deleteClient(payload: Client) {
    this.context.commit('SET_LOADING', true)

    try {
      const id = payload.id
      const response = await axios.delete(`/client/${id}`)

      if (response.status === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    } finally {
      this.context.commit('SET_LOADING', false)
    }
  }

  @Action
  async createClient(payload: RegisterClientInput) {
    this.context.commit('SET_LOADING', true)

    try {
      const response = await axios.post(`/client/`, payload)

      if (response.status === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    } finally {
      this.context.commit('SET_LOADING', false)
    }
  }

  /* --------------------------- TABLE RELATED START -------------------------- */
  public table: Array<any> | null = null
  public tableUri = '/client/paginated'
  public isLoading = false
  public countRows = 0
  public options = TableHelpers.generateOptions(1, 20, 'active')
  public headers = TableHelpers.generateHeaders({
    id: 'ID',
    hash: 'Пароль',
    name: 'Имя',
    phone: 'Телефон',
    email: 'Почта',
    rate: 'Тариф',
    discount: 'Скидка',
    paymentType: 'Отсрочка оплаты',
    paymentWho: 'Кто платит',
    paymentForm: 'Форма оплаты',
    attract: 'Кто привлёк',
    food: 'Еда',
    freeIn: '(Б) занос',
    freeOut: '(Б) вынос',
    freeCash: '(Б) выручка',
    freePay: '(Б) выкуп',
    freeExtraPoint: '(Б) доп. точки',
    region: 'Регион',
    expressDelivery: 'Приоритетная доставка',
    alwaysIn: 'Всегда заносим',
    alwaysOut: 'Всегда выносим',
    actions: 'Действия',
  })
  get headersFormatted() {
    return TableHelpers.excludeNotShownHeaders(this.headers)
  }
  get itemsNormalized() {
    return map(this.table as Array<Client>, (e) => {
      return {
        id: e.id,
        hash: e.hash,
        name: e.name,
        phone: e.phone,
        email: e.email,
        rate: e.rate,
        discount: e.discount,
        paymentType: e.paymentType,
        paymentWho: e.paymentWho,
        paymentForm: e.paymentForm,
        attract: e.attract,
        food: e.food,
        freeIn: e.free.in,
        freeOut: e.free.out,
        freeCash: e.free.cash,
        freePay: e.free.pay,
        freeExtraPoint: e.free.extraPoint,
        region: e.region,
        expressDelivery: e.expressDelivery,
        alwaysIn: e.alwaysIn,
        alwaysOut: e.alwaysOut,
      }
    })
  }
  @Mutation
  SET_LOADING(payload: boolean) {
    this.isLoading = payload
  }
  @Mutation
  SET_TABLE(payload: any) {
    this.table = payload.docs
    this.countRows = payload.totalDocs
  }
  @Mutation
  CLEAR_TABLE() {
    this.table = null
    this.countRows = 0
  }
  @Mutation
  SET_OPTIONS(payload: any) {
    this.options = payload
  }
  @Mutation
  UPDATE_HEADERS(payload: any) {
    this.headers = payload
  }
  @Action
  updateOptions(payload: any) {
    this.context.commit('SET_OPTIONS', payload)
  }
  @Action
  changeHeaderVisibility(payload: { header: string; value: boolean }) {
    this.context.commit('UPDATE_HEADERS', TableHelpers.changeHeaderVisibility(this.headers, payload))
  }
  @Action
  clearTable() {
    this.context.commit('CLEAR_TABLE')
  }
  @Action
  async fetch() {
    this.context.commit('SET_LOADING', true)

    const response = await axios.get(this.tableUri, { params: TableHelpers.processQuery(this.options) })

    this.context.commit('SET_TABLE', response.data)
    this.context.commit('SET_LOADING', false)
  }
  @Action
  socket_updateClients() {
    this.context.dispatch('fetch')
  }
  /* ---------------------------- TABLE RELATED END --------------------------- */
}
