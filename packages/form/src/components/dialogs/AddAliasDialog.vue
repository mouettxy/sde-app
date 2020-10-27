<template lang="pug">
.add-alias-dialog
  v-dialog(
    v-model='value',
    :fullscreen='isMobile',
    transition='dialog-bottom-transition',
    max-width='50%'
  )
    v-card
      v-card-title
        span {{ $t("aliasField.header") }}
        v-spacer
        v-btn(
          @click='value = false',
          icon
        )
          v-icon mdi-close
      v-card-text
        v-form(@submit.prevent='addAlias')
          v-text-field(
            v-model='aliasName',
            :label='$t("aliasField.label")',
            :error-messages='errMsg',
            :color='defaultInputColor',
            :hint='$t("aliasField.hint")',
            autocomplete='chrome-off'
          )
          v-btn(
            @click='addAlias',
            color='primary'
          ) {{ $t("aliasField.btn") }}
  slot(
    name='button',
    :open='openDialog'
  )
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'

import { breakpoints, colors } from '@/mixins'
import { authModule } from '@/store'
import { includes, map } from 'lodash'

@Component({})
export default class AddAliasDialog extends Mixins(breakpoints, colors) {
  @Prop(Object) alias: any
  public value = false
  public aliasName = ''
  public errMsg = ''

  openDialog() {
    this.value = true
  }

  async addAlias() {
    if (!this.aliasName) {
      this.$notification.error('Укажите название адреса для сохранения')
      return Promise.resolve(false)
    }

    if (
      includes(
        map(authModule.aliases, (e) => e.name),
        this.aliasName,
      )
    ) {
      this.$notification.error('Адрес с таким названием уже существует')
      return Promise.resolve(false)
    }

    if (typeof authModule.user === 'string' || authModule.user === null) {
      this.$notification.error('Невозможно сохранить адрес когда у вас нет аккаунта')
      return Promise.resolve(false)
    }

    const status = await authModule.addAlias({
      id: this.alias.id,
      fields: this.alias.fields,
      name: this.aliasName,
      address: this.alias.address,
      lat: this.alias.lat,
      lon: this.alias.lon,
    })

    if (status) {
      this.$notification.success('Успешное добавление адреса.')
      return Promise.resolve(true)
    } else {
      this.$notification.error('Ошибка сервера. Повторите позднее...')
      return Promise.resolve(false)
    }
  }
}
</script>

<style lang="sass"></style>
