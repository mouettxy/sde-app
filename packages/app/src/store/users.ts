import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { TableHelpers } from '@/store/helpers'
import axios from '@/plugins/axios'
import { User } from '@/typings/user'

@Module({
  namespaced: true,
  name: 'users',
})
export default class Users extends VuexModule {
  @Action
  async updateUser(payload: any) {
    this.context.commit('SET_LOADING', true)

    try {
      const response = await axios.put(`/user/${payload.id}`, payload.data)

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
  async deleteUser(payload: User) {
    this.context.commit('SET_LOADING', true)

    try {
      const id = payload._id
      const response = await axios.delete(`/user/${id}`)

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
  public tableUri = '/user/paginated'
  public isLoading = false
  public countRows = 0
  public options = TableHelpers.generateOptions(1, 20, 'active')
  public headers = TableHelpers.generateHeaders({
    username: 'Никнейм',
    comment: 'Комментарий',
    phone: 'Телефон',
    email: 'Почта',
    credentials: 'ФИО',
    workTime: 'Время работы',
    active: 'Активен',
    canTakeOrders: 'Может брать заявки',
    isSdeTransport: 'Транспорт SDE',
    transport: 'Транспорт',
    region: 'Регион',
    permissionsLevel: 'Уровень прав',
    role: 'Должность',
    actions: 'Действия',
  })
  get headersFormatted() {
    return TableHelpers.excludeNotShownHeaders(this.headers)
  }
  get itemsNormalized() {
    return TableHelpers.normalizeResponse(this.table, [
      '_id',
      'username',
      'comment',
      'phone',
      'email',
      'credentials',
      'active',
      'canTakeOrders',
      'workTime',
      'role',
      'transport',
      'region',
      'permissionsLevel',
      'isSdeTransport',
      'lastActive',
      'actions',
    ])
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
  socket_updateUsers() {
    this.context.dispatch('fetch')
  }
  /* ---------------------------- TABLE RELATED END --------------------------- */
}
