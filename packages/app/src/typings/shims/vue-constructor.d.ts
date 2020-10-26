import Vue from 'vue'
import { NotificationPlugin } from '@/typings/misc/NotificationsPlugin'
import { AxiosInstance } from 'axios'

declare module 'vue/types/vue' {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface Vue {
    $notification: NotificationPlugin
    $axios: AxiosInstance
  }
}
