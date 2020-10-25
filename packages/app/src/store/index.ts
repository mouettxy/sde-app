import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/store/auth'
import users from '@/store/users'
import clients from '@/store/clients'
import orders from '@/store/orders'
import createPersistedState from 'vuex-persistedstate'

import { getModule } from 'vuex-module-decorators'

Vue.use(Vuex)

export const persistedState = createPersistedState({
  paths: ['auth'],
})

export const store = new Vuex.Store({
  state: {},
  modules: {
    auth,
    users,
    clients,
    orders,
  },
  plugins: [persistedState],
})

export const authModule = getModule(auth, store)
export const usersModule = getModule(users, store)
export const clientsModule = getModule(clients, store)
export const ordersModule = getModule(orders, store)

export default store
