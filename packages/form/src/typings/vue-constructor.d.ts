import Vue from 'vue'
import { NotificationPlugin } from './NotificationsPlugin'

declare module 'vue/types/vue' {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface Vue {
    $notification: NotificationPlugin
  }
}
