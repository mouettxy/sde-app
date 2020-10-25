<template lang="pug">
v-app
  nprogress-container
  sde-nav(
    :title='$route.meta.header',
    @click-menu='toggleDrawer'
  )
  v-navigation-drawer(
    v-model='drawer',
    clipped,
    app
  )
    v-list(nav)
      v-list-item-group
        template(v-if='!user')
          v-list-item(
            target='_blank',
            href='https://api.sde.ru.com/client/cabinet.php'
          )
            v-list-item-icon
              v-icon mdi-account
            v-list-item-content
              v-list-item-title Кабинет клиента
          v-list-item(
            target='_blank',
            href='https://sde.ru.com/#contacts'
          )
            v-list-item-icon
              v-icon mdi-contacts
            v-list-item-content
              v-list-item-title Контакты
          v-list-item(
            target='_blank',
            href='https://sde.ru.com/payment'
          )
            v-list-item-icon
              v-icon mdi-account-cash
            v-list-item-content
              v-list-item-title Оплата
          v-list-item(
            target='_blank',
            href='https://sde.ru.com/#prices'
          )
            v-list-item-icon
              v-icon mdi-cash-check
            v-list-item-content
              v-list-item-title Цены
        template(v-else-if='user.role === "expeditor"')
        template(v-else-if='user.role === "logist" || user.role === "administrator" || user.role === "manager"')
          v-list-item(:to='{ name: "logistIndex" }')
            v-list-item-icon
              v-icon mdi-chart-box
            v-list-item-content
              v-list-item-title Рабочий стол
          v-list-item(:to='{ name: "logistOrders" }')
            v-list-item-icon
              v-icon mdi-clipboard-alert
            v-list-item-content
              v-list-item-title Заявки
          v-list-item(:to='{ name: "logistClients" }')
            v-list-item-icon
              v-icon mdi-account-multiple
            v-list-item-content
              v-list-item-title Клиенты
          v-list-item(:to='{ name: "logistUsers" }')
            v-list-item-icon
              v-icon mdi-account-hard-hat
            v-list-item-content
              v-list-item-title Пользователи
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

  @Socket()
  onSocketConnected() {
    console.log('socket connected')
  }

  @Watch('header')
  onRouteHeaderChange(value: string) {
    document.title = value
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
