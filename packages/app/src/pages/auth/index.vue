<route>
{
  "name": "login",
  "meta": {
    "header": "Авторизация"
  }
}
</route>

<template lang="pug">
.page__auth-login
  vue-particles.login-particles(
    particleOpacity.number='0.4',
    color='#FFCC01'
  )
  v-card.login-card(elevation='1')
    v-card-text
      v-form(ref='form')
        sde-input(
          v-model='user.username',
          label='Логин',
          icon='mdi-account'
        )
        sde-input(
          v-model='user.password',
          type='password',
          label='Пароль',
          icon='mdi-account'
        )
        sde-button(
          @click='authorizeUser',
          color='primary'
        ) Авторизоваться
</template>

<script lang="ts">
import { authModule } from '@/store'
import { includes } from 'lodash'
import { Component, Ref, Vue } from 'vue-property-decorator'

@Component({
  layout: 'centered',
})
export default class PageAuthLogin extends Vue {
  @Ref('form') form: any
  public user = {
    username: '',
    password: '',
  }

  async authorizeUser() {
    if (this.form.validate()) {
      if (await authModule.login(this.user)) {
        this.$notification.success('Успешная авторизация!')

        if (includes(['administrator', 'logist', 'manager'], authModule.user.role)) {
          this.$router.push({ name: 'logistIndex' })
        } else if (authModule.user.role === 'expeditor') {
          this.$router.push({ name: 'expeditorIndex' })
        }
      } else {
        this.$notification.error('Ошибка сервера')
      }
    } else {
      this.$notification.error('Ошибка валидации формы')
    }
  }
}
</script>

<style lang="sass">
.page__auth-login
  align-self: center
  .login-particles
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
</style>
