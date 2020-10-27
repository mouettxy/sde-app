import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { clientApi as api } from '@/api/'
import bcrypt from 'bcryptjs'
import { cloneDeep, isNull } from 'lodash'
import Vue from 'vue'
import { addressesModule } from '.'

export type User = {
  CLIENT: string
  ADDR: string
  customer_name: string
  customer_adress_comment: string
  customer_phone: string
  who_attracted: string
  Input: string
  payment_type: string
  payment_who: string
  discount: string
  customer_food: string
  free_in: string
  free_out: string
  free_cash: string
  free_pay: string
  free_extra_point: string
  priority_delivery: string
  always_out: string
  always_in: string
  stop_delivery: string
  payment_form: string
  hash: string
  aliases: string
  saved_orders: string
  password: string
  region: string
}

export type AuthInput = {
  type: string
  login?: string
  password?: string
  needRemember?: boolean
}

export type RelogInput = {
  type: string
  id: number | string
}

@Module({
  name: 'auth',
  namespaced: true
})
export default class Auth extends VuexModule {
  public user: User | string | null = null
  private temp: any = null
  public isNewUser = false
  public isLoggedIn = false

  get aliases() {
    if (typeof this.user !== 'string' && this.user?.aliases) {
      return JSON.parse(this.user?.aliases)
    } else {
      return []
    }
  }

  get addresses() {
    if (typeof this.user !== 'string' && this.user?.saved_orders) {
      return JSON.parse(this.user?.saved_orders)
    } else {
      return []
    }
  }

  @Mutation
  SET_USER(payload: User | string) {
    this.user = payload
    this.isLoggedIn = true
    this.isNewUser = false
    this.temp = null
  }

  @Mutation
  SET_NEW_USER(payload: boolean) {
    this.isNewUser = payload
    this.temp = null
  }

  @Mutation
  SAVE_TEMP_USER_DATA(payload: any) {
    this.temp = payload
  }

  @Mutation
  REMOVE_USER() {
    this.user = null
    this.isLoggedIn = false
    this.isNewUser = true
    this.temp = null
  }

  @Mutation
  UPDATE_ALIAS(payload: any) {
    const aliases = cloneDeep(payload.aliases)
    aliases.push(payload.payload)
    ;(this.user as User).aliases = JSON.stringify(aliases)
  }

  @Action
  async login(payload: AuthInput) {
    const passwordCheck = async (user: User, password: string): Promise<boolean> => {
      if (isNull(user.password)) {
        if (user.hash === password) {
          return Promise.resolve(true)
        }
      } else {
        try {
          const isMatch = await bcrypt.compare(password, user.password)
          return isMatch
        } catch (err) {
          return Promise.resolve(false)
        }
      }

      return Promise.resolve(false)
    }

    const authorizeUser = async (user: User, password: string) => {
      const isPasswordsMatch = await passwordCheck(user, password)

      if (isPasswordsMatch) {
        this.context.commit('SET_USER', user)
        Vue.$cookies.set('remembered-id', user.CLIENT)

        return Promise.resolve({ type: 'success', message: 'Успешная авторизация' })
      } else {
        return Promise.resolve({ type: 'error', message: 'Неверный пароль' })
      }
    }

    if (payload.type === 'default') {
      if (payload.login && !payload.password) {
        try {
          const response = await api.getClient(payload.login)
          if (response.status === 200) {
            this.context.commit('SAVE_TEMP_USER_DATA', response.data)
            return { type: 'need-password', message: '' }
          } else {
            return { type: 'error', message: 'Ошибка сервера, проверьте данные.' }
          }
        } catch (error) {
          this.context.commit('SET_USER', payload.login)
          this.context.commit('SET_NEW_USER', true)
          return { type: 'success', message: `Добро пожаловать в SDE "${payload.login}"!` }
        }
      } else if (payload.login && payload.password) {
        if (this.temp) {
          return await authorizeUser(this.temp, payload.password)
        } else {
          try {
            const response = await api.getClient(payload.login)

            if (response.status === 200) {
              return await authorizeUser(response.data, payload.password)
            } else {
              return { type: 'error', message: 'Ошибка сервера, проверьте данные.' }
            }
          } catch (error) {
            return { type: 'error', message: 'Ошибка сервера, проверьте данные.' }
          }
        }
      }
    }

    return { type: 'error', message: 'Ошибка сервера, проверьте данные.' }
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
    if (payload.type === 'default') {
      const response = await api.getClient(payload.id)

      if (response.status === 200) {
        this.context.commit('SET_USER', response.data)
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    }

    return Promise.resolve(false)
  }

  @Action
  async addAlias(payload: any) {
    try {
      const response = await api.setAliases((this.user as User).CLIENT, payload)
      if (response.status === 200) {
        this.UPDATE_ALIAS({ payload, aliases: this.aliases })
        addressesModule.SET_IS_ALIAS(payload.id)
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    } catch (e) {
      return Promise.resolve(false)
    }
  }
}
