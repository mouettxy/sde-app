import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/store/auth'
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
  },
  plugins: [persistedState],
})

export const authModule = getModule(auth, store)

export default store
