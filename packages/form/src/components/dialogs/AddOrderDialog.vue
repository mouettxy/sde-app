<template lang="pug">
.add-order-dialog
  v-dialog(
    v-model='value',
    :fullscreen='isMobile',
    transition='dialog-bottom-transition',
    max-width='50%'
  )
    v-card
      v-card-title
        span {{ $t("orderField.header") }}
        v-spacer
        v-btn(
          @click='value = false',
          icon
        )
          v-icon mdi-close
      v-card-text
        h4.error--text {{ $t("orderField.disclaimer") }}
        v-form(@submit.prevent='saveOrder')
          v-text-field(
            v-model='orderName',
            :label='$t("orderField.label")',
            :color='defaultInputColor',
            :hint='$t("orderField.hint")',
            prepend-inner-icon='mdi-content-save',
            auocomplete='chrome-off'
          )
          v-btn(
            @click='saveOrder',
            color='primary'
          ) {{ $t("orderField.btn") }}
  slot(
    name='buttons',
    :open='openDialog'
  )
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'

import { breakpoints, colors } from '@/mixins'
import { addressesModule, authModule } from '@/store'
import { includes, map } from 'lodash'
import { User } from '@/typings/api'

@Component
export default class AddOrderDialog extends Mixins(breakpoints, colors) {
  public value = false
  public orderName = ''

  openDialog() {
    this.value = true
  }

  async saveOrder() {
    if (!this.orderName) {
      this.$notification.error(this.$t('orderField.hint') as string)
    }

    if (
      includes(
        map((authModule.user as User).orders, (e) => e.name),
        this.orderName,
      )
    ) {
      this.$notification.error('Сохранённая заявка с таким названием уже существует')
      return Promise.resolve(false)
    }

    this.$emit('save-start')

    const response = await addressesModule.saveOrder(this.orderName)

    switch (response.status) {
      case 'ERROR':
        this.$notification.error(response.message)
        break
      case 'ERROR-SAVED':
        this.$notification.error(response.message)
        break
      case 'OK':
        this.$notification.success(response.message)
        break
      case 'OK-SAVED':
        this.$notification.success(response.message)
        break
    }
  }
}
</script>

<style lang="sass"></style>
