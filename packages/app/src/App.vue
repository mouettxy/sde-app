<template lang="pug">
v-app
  nprogress-container
  sde-nav(
    :title='$route.meta.header',
    @click-menu='toggleDrawer'
  )
    sde-button(
      to='/',
      icon
    ) mdi-home
  v-navigation-drawer(
    v-model='drawer',
    clipped,
    app
  )
    v-list(nav)
      v-list-item-group
        template(v-for='(items, role) in menu')
          template(v-if='userRole === role')
            template(v-for='item in items')
              template(v-if='item.to')
                v-list-item(
                  :to='item.to',
                  :target='item.target'
                )
                  v-list-item-icon
                    v-icon {{ item.icon }}
                  v-list-item-content
                    v-list-item-title {{ item.text }}
              template(v-else)
                v-list-item(
                  :target='item.target',
                  :href='item.href'
                )
                  v-list-item-icon
                    v-icon {{ item.icon }}
                  v-list-item-content
                    v-list-item-title {{ item.text }}
        template(v-if='!user')
          v-list-item(:to='{ name: "login" }')
            v-list-item-icon
              v-icon mdi-login
            v-list-item-content
              v-list-item-title Вход
        template(v-else)
          v-list-item(:to='{ name: "logout" }')
            v-list-item-icon
              v-icon mdi-logout
            v-list-item-content
              v-list-item-title Выход
  v-main
    v-container.container-main(fluid)
      router-view
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { authModule } from '@/store'
import { Socket } from 'vue-socket.io-extended'
import NprogressContainer from 'vue-nprogress/src/NprogressContainer.vue'

@Component({
  components: {
    NprogressContainer,
  },
})
export default class App extends Vue {
  public drawer = true

  public menu = {
    guest: [
      {
        target: '_blank',
        href: 'https://api.sde.ru.com/client/cabinet.php',
        icon: 'mdi-account',
        text: 'Кабинет клиента',
      },
      {
        target: '_blank',
        href: 'https://sde.ru.com/#contacts',
        icon: 'mdi-contacts',
        text: 'Контакты',
      },
      {
        target: '_blank',
        href: 'https://sde.ru.com/payment',
        icon: 'mdi-account-cash',
        text: 'Оплата',
      },
      {
        target: '_blank',
        href: 'https://sde.ru.com/#prices',
        icon: 'mdi-cash-check',
        text: 'Цены',
      },
    ],
    courier: [
      {
        target: '_self',
        to: { name: 'courierIndex' },
        icon: 'mdi-clipboard-account',
        text: 'Рабочий стол',
      },
      {
        target: '_self',
        to: { name: 'courierOrders' },
        icon: 'mdi-clipboard-alert',
        text: 'Заявки',
      },
    ],
    logist: [
      {
        target: '_self',
        to: { name: 'logistIndex' },
        icon: 'mdi-chart-box',
        text: 'Рабочий стол',
      },
      {
        target: '_self',
        to: { name: 'logistOrders' },
        icon: 'mdi-clipboard-alert',
        text: 'Заявки',
      },
      {
        target: '_self',
        to: { name: 'logistClients' },
        icon: 'mdi-account-multiple',
        text: 'Клиенты',
      },
      {
        target: '_self',
        to: { name: 'logistUsers' },
        icon: 'mdi-account-hard-hat',
        text: 'Пользователи',
      },
    ],
    administrator: [
      {
        target: '_self',
        to: { name: 'logistIndex' },
        icon: 'mdi-chart-box',
        text: 'Рабочий стол',
      },
      {
        target: '_self',
        to: { name: 'logistOrders' },
        icon: 'mdi-clipboard-alert',
        text: 'Заявки',
      },
      {
        target: '_self',
        to: { name: 'logistClients' },
        icon: 'mdi-account-multiple',
        text: 'Клиенты',
      },
      {
        target: '_self',
        to: { name: 'logistUsers' },
        icon: 'mdi-account-hard-hat',
        text: 'Пользователи',
      },
    ],
  }

  @Watch('header')
  onRouteHeaderChange(value: string) {
    document.title = value
  }

  get userRole() {
    return this.user ? this.user.role : 'guest'
  }

  get user() {
    return authModule.user
  }

  get header() {
    return this.$route.meta.header
  }

  toggleDrawer() {
    this.drawer = !this.drawer
  }
}
</script>

<style lang="sass">
#nprogress
  .bar
    background: #151515
  .spinner-icon
    border-top-color: #151515
    border-left-color: #151515
.container-main
  height: 100%
</style>
