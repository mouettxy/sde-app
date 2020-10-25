import Vue from 'vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import store from '@/store'

export const socket = io(
  (process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_SOCKET_URL_PRODUCTION
    : process.env.VUE_APP_SOCKET_URL_DEVELOPEMENT) as string,
)

Vue.use(VueSocketIOExt, socket, { store })
