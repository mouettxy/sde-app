<route>
{
  "name": "logout",
  "meta": {
    "header": "Авторизация"
  }
}
</route>

<template lang="pug">
.page__auth-logout
  vue-particles.logout-particles(
    particleOpacity.number='0.4',
    color='#FFCC01'
  )
  v-card.logout-card(elevation='1')
    v-card-text
      sde-button(
        @click='logout',
        color='primary'
      ) Выйти
</template>

<script lang="ts">
import { authModule } from '@/store'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'centered',
})
export default class PageAuthLogin extends Vue {
  async logout() {
    if (await authModule.logout()) {
      this.$notification.success('Успешный выход из аккаунта')

      this.$router.push({ name: 'index' })
    } else {
      this.$notification.error('Ошибка сервера')
    }
  }
}
</script>

<style lang="sass">
.page__auth-logout
  align-self: center
  .logout-particles
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
</style>
