<template lang="pug">
v-card.elevation-3.auth__field
  v-form
    v-scroll-y-transition
      v-text-field(
        :class='{"password": showPassword}',
        v-if='!isLoggedIn',
        prepend-inner-icon='mdi-account',
        :loading='isLoading',
        :success-messages='sucMsg',
        :error-messages='errMsg',
        v-model='login',
        :color='defaultInputColor',
        persistent-hint,
        autocomplete='sde_login_form_hsvv',
        :hint='$t("loginHint")',
        :label='$t("loginLabel")'
      )
    v-scroll-y-transition
      v-text-field.pb-4(
        v-if='showPassword',
        prepend-inner-icon='mdi-lock',
        append-icon='mdi-login',
        @click:append='auth',
        type='password',
        v-model='password',
        :color='defaultInputColor',
        persistent-hint,
        autocomplete='sde_password_form_mxxt',
        :hint='$t("passwordHint")',
        :label='$t("passwordLabel")'
      )
  v-slide-y-transition
    template(v-if='isLoggedIn')
      v-list(v-if='user')
        v-list-item
          v-list-item-content(v-if='isNewUser')
            v-list-item-title {{ `${$t("newUserWelcome")} ${user}!` }}
          v-list-item-content(v-if='!isNewUser')
            v-list-item-title {{ `${$t("authIdText")} ${user.CLIENT}.` }}
            v-list-item-subtitle {{ `${$t("authUserText")} ${user.customer_name}.` }}
          v-list-item-action
            v-btn(icon, @click='logout', :content='$t("logoutButtonTip")', v-tippy)
              v-icon mdi-close
  v-slide-y-transition
    template(v-if='isLoggedIn')
      base-alert(unique-id='tourNotification')
        v-row
          v-col
            .text-subtitle-1 Быстрый тур по новой форме. Мы покажем и расскажем как тут всё теперь работает!
        v-row
          v-col
            v-btn(color='info', @click='getTour') Хочу узнать!
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { colors } from '@/mixins'
import { authModule, addressesModule } from '@/store'
import { debounce } from 'lodash'

import BaseAlert from '@/components/BaseAlert.vue'

@Component({
  components: {
    BaseAlert
  }
})
export default class ClientField extends Mixins(colors) {
  private debounced?: any

  public isLoading: boolean | string = false
  public errMsg = ''
  public sucMsg = ''

  public login = ''
  public password = ''
  public showPassword = false
  public needRemember = false

  get user() {
    return authModule.user
  }

  get isLoggedIn() {
    return authModule.isLoggedIn
  }

  get isNewUser() {
    return authModule.isNewUser
  }

  @Watch('login')
  onValueChange(val: string) {
    if (val) {
      this.debounced()
    } else {
      this.sucMsg = ''
      this.errMsg = ''
      this.showPassword = false
    }
  }

  getTour() {
    this.$tours['userGuideline'].start()
  }

  async logout() {
    this.sucMsg = ''
    this.errMsg = ''
    this.showPassword = false
    this.login = ''
    this.password = ''
    await authModule.logout()
  }

  async auth() {
    this.isLoading = true
    const response = await authModule.login({
      type: 'default',
      login: this.login,
      password: this.password
    })

    if (response.type === 'error') {
      this.$notification.error(response.message)
      this.sucMsg = ''
      this.errMsg = response.message
      addressesModule.reset()
    } else if (response.type === 'need-password') {
      this.errMsg = ''
      this.sucMsg = ''
      this.showPassword = true
      addressesModule.reset()
    } else if (response.type === 'success') {
      this.$notification.success(response.message)
      this.errMsg = ''
      this.sucMsg = response.message
      this.showPassword = false
    }
    this.isLoading = false
  }

  created() {
    this.debounced = debounce(this.auth, 500)
  }
}
</script>

<style lang="sass" scoped>
.auth__field
  .v-input
    padding-left: 24px
    padding-right: 24px

    &:first-child
      padding-top: 32px
      padding-bottom: 32px

      &.password
        padding-bottom: 0
</style>
