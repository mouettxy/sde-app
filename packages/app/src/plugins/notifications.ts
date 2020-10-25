import Vue from 'vue'
import VueNotification from '@kugatsu/vuenotification'
import { TimelineMax } from 'gsap'
import { NotificationPluginOptions } from '@/typings/misc/NotificationsPlugin'

Vue.use(VueNotification, {
  timer: 7,
  showCloseIcn: true,
  animateIn: function () {
    const el = this.notificationEl
    const tl = new TimelineMax()

    tl.from(el, 0.4, {
      left: 999,
      width: 0,
      position: 'absolute',
    })

    return tl
  },
  animateOut: function () {
    const el = this.notificationEl
    const tl = new TimelineMax()
    tl.to(el, 0.5, {
      opacity: 0,
    })

    return tl
  },
} as NotificationPluginOptions)
