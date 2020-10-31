import { map } from 'lodash'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { TableHelpers } from '@/store/helpers'
import axios from '@/plugins/axios'
import { Order } from '@/typings/order'
import moment from 'moment'

moment.locale('ru')

@Module({
  namespaced: true,
  name: 'orders',
})
export default class Orders extends VuexModule {
  @Action
  async getFiltered(payload: { status?: string }) {
    const params = payload
    if (!params.status) {
      params.status = 'Новая'
    }

    this.context.commit('SET_LOADING', true)

    try {
      const response = await axios.get(`/order/filtered`, { params: payload })

      if (response.status === 200) {
        return response.data
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
  async copyOne(payload: string | number) {
    this.context.commit('SET_LOADING', true)

    try {
      const response = await axios.get(`/order/${payload}/copy`)

      if (response.status === 200) {
        return response.data
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
  async copyMany(payload: any) {
    this.context.commit('SET_LOADING', true)

    try {
      const response = await axios.get(`/order/copy`, { params: payload })

      if (response.status === 200) {
        return response.data
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
  async updateOrder(payload: { id: string | number; data: Record<string, any> }) {
    this.context.commit('SET_LOADING', true)

    try {
      const id = payload.id
      const response = await axios.put(`/order/${id}`, payload)

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
  async deleteOrder(payload: string | number) {
    this.context.commit('SET_LOADING', true)

    try {
      const response = await axios.delete(`/order/${payload}`)

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
  public table: Array<Order> | null = null
  public tableUri = '/order/paginated'
  public isLoading = false
  public countRows = 0
  public options: any = TableHelpers.generateOptions(1, 20, 'id', function (options: any) {
    return {
      ...options,
      filter: [{ type: 'in', key: 'status', value: ['Новая', 'В работе'] }],
    }
  })
  public headers = TableHelpers.generateHeaders({
    id: '№',
    month: 'Месяц',
    date: 'Дата',
    orderTime: 'Создано',
    orderFromTime: 'От',
    orderToTime: 'До',
    status: 'Статус',
    transport: 'Транспорт',
    to: 'Откуда',
    from: 'Куда',
    clientId: '№ Клиента',
    clientName: 'Имя клиента',
    clientPhone: 'Телефон клиента',
    clientRate: 'Тариф клиента',
    region: 'Регион',
    courier: 'Курьер',
    courierCredentials: 'Курьер ФИО',
    logist: 'Логист',
    timeInTravel: 'Время в пути',
    promocode: 'Промокод',
    discount: 'Скидка',
    debt: 'Долг',
    express: 'Срочно',
    payed: 'Оплачено',
    comment: 'Комментарий',
    paymentWho: 'Кто платит',
    paymentForm: 'Форма оплаты',
    paymentType: 'Тип оплаты',
    additionals: 'Дополнительно',
    mileage: 'Пробег',
    buyin: 'Выручка',
    total: 'Цена',
    totalDiscounted: 'Цена со скидкой',
    totalAdditionals: 'Цена дополнительного',
    actions: 'Действия',
  })
  get headersFormatted() {
    return TableHelpers.excludeNotShownHeaders(this.headers)
  }
  get itemsNormalized() {
    return map(this.table as Array<Order>, (e) => {
      const date = moment(e.date).format('DD.MM.YYYY')
      const orderTime = moment(e.orderTime).format('HH:mm:ss')
      const orderToTime = moment(e.orderToTime).format('DD.MM.YYYY HH:mm')
      const orderFromTime = moment(e.orderFromTime).format('DD.MM.YYYY HH:mm')

      return {
        id: e.id,
        month: e.month,
        date,
        orderTime,
        orderFromTime,
        orderToTime,
        status: e.status,
        transport: e.transport,
        to: e.to,
        from: e.from,
        clientId: e.clientId,
        clientName: e.clientName,
        clientPhone: e.clientPhone,
        clientRate: e.clientRate,
        region: e.region,
        courier: e.courier,
        courierCredentials: e.courierCredentials,
        logist: e.logist,
        timeInTravel: e.timeInTravel,
        promocode: e.promocode,
        discount: e.discount,
        debt: e.debt,
        express: e.express,
        payed: e.payed,
        comment: e.comment,
        paymentWho: e.paymentWho,
        paymentForm: e.paymentForm,
        paymentType: e.paymentType,
        additionals: e.additionals,
        mileage: e.mileage,
        buyin: e.buyin,
        total: e.total,
        totalDiscounted: e.totalDiscounted,
        totalAdditionals: e.totalAdditionals,
        actions: '',
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
  //@ts-ignore
  socket_updateOrders() {
    this.context.dispatch('fetch')
  }
  /* ---------------------------- TABLE RELATED END --------------------------- */
}
