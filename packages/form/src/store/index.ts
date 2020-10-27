import Vue from 'vue'
import Vuex from 'vuex'

import addresses from '@/store/addresses'
import auth from '@/store/auth'
import price from '@/store/price'

import { getModule } from 'vuex-module-decorators'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {},
  modules: {
    auth,
    addresses,
  },
  plugins: [price],
})

export const authModule = getModule(auth, store)
export const addressesModule = getModule(addresses, store)

export default store
