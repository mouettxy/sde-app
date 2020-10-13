import { AuthInput, RegisterInput } from '@/typings/auth'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import axios from '@/plugins/axios'

@Module({
  namespaced: true,
  name: 'auth',
})
export default class Auth extends VuexModule {
  public user: any = null
  public isLoggedIn = false

  @Mutation
  LOGIN(payload: any) {
    this.user = payload
    this.isLoggedIn = true
  }

  @Mutation
  LOGOUT() {
    this.user = null
    this.isLoggedIn = false
  }

  @Action
  async login(payload: AuthInput) {
    const response = await axios.post('/auth/login', payload)

    if (response) {
      this.context.commit('LOGIN', response)
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }

  @Action
  async logout() {
    const response = await axios.post('/auth/logout')

    if (response) {
      this.context.commit('LOGOUT')
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }

  @Action
  async register(payload: RegisterInput) {
    const response = await axios.post('/auth/register', payload)

    if (response) {
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }
}
