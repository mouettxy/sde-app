import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { userApi as api } from '@/api/'
import Vue from 'vue'
import { addressesModule } from '.'
import { User } from '@/typings/api'

export type AuthInput = {
  login?: string
  password?: string
}

export type RelogInput = {
  id: number | string
}

@Module({
  name: 'auth',
  namespaced: true,
})
export default class Auth extends VuexModule {
  public user: User | string | null = null
  public isLoggedIn = false

  get isNewUser() {
    return typeof this.user === 'string'
  }

  @Mutation
  SET_USER(payload: User | string) {
    this.user = payload
    this.isLoggedIn = true
  }

  @Mutation
  REMOVE_USER() {
    this.user = null
    this.isLoggedIn = false
  }

  @Action
  async ping(payload: string | number) {
    return await api.ping(payload)
  }

  @Action
  async login(payload: AuthInput) {
    const login = payload.login
    const password = payload.password

    if (login && password) {
      const response = await api.login(login, password)

      if (response) {
        Vue.$cookies.set('remembered-id', response.id)
        this.context.commit('SET_USER', response)
        return true
      } else {
        return false
      }
    } else if (login && !password) {
      this.context.commit('SET_USER', login)

      return true
    }

    return false
  }

  @Action
  logout() {
    Vue.prototype.$cookies.remove('remembered-id')
    this.context.commit('REMOVE_USER')
    addressesModule.reset(true)

    return true
  }

  @Action
  async relog(payload: RelogInput) {
    const response = await api.get(payload.id)

    if (!(response.data === false)) {
      this.context.commit('SET_USER', response)
      return true
    } else {
      return false
    }
  }

  @Action
  async addAlias(payload: any) {
    try {
      if (!this.isNewUser) {
        const response = await api.setAliases((this.user as User).id, payload)
        if (response) {
          return true
        } else {
          return false
        }
      }
    } catch (e) {
      return false
    }
  }

  @Action
  async socket_updatedClient(evt: any) {
    if (this.user && typeof this.user !== 'string' && this.isLoggedIn) {
      if (evt.id === this.user.id) {
        this.context.commit('SET_USER', evt)
      }
    }
  }
}
