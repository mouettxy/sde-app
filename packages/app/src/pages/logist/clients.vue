<route>
{
  "name": "logistClients",
  "meta": {
    "header": "Клиенты"
  }
}
</route>

<template lang="pug">
.page-logist-clients
  sde-remote-table(
    :store='store',
    no-data-text='Не удалось найти клиентов',
    loading-text='Загружаем Клиентов...',
    item-key='username'
  )
    template(#toolbar)
      sde-button(
        @click='enableInteractive = !enableInteractive',
        icon
      ) mdi-pencil
      modal-create-client
        template(#activator='{on, attrs}')
          sde-button(
            v-on='on',
            v-bind='attrs',
            icon
          ) mdi-plus
    template(#body='{items, headers}')
      tbody
        sde-remote-table-row(
          v-for='item in items',
          :key='item.id',
          :item='item'
        )
          sde-remote-table-cell(
            v-for='(column, key) in item',
            :types='columnTypes',
            :selects='columnSelects',
            :item='item',
            :headers='headers',
            :edit='enableInteractive',
            :column-key='key',
            :column='column',
            @change='onUpdate'
          )
            template(#actions.edit='{item}')
              sde-button(
                @click='onDelete(item)',
                icon,
                color='error'
              ) mdi-delete
            template(#actions.text)
              span НРР
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator'
import { clientsModule } from '@/store'
import { Client, ClientFree } from '@/typings/client'
import { find, kebabCase } from 'lodash'
import { paymentFormSelect, paymentTypeSelect, paymentWhoSelect, regionsSelect } from '@/api/formSelectFields'

@Component
export default class PageLogistClients extends Vue {
  public enableInteractive = false

  public columnTypes = {
    checkbox: [
      'food',
      'stopDelivery',
      'expressDelivery',
      'alwaysIn',
      'alwaysOut',
      'freeIn',
      'freeOut',
      'freeCash',
      'freePay',
      'freeExtraPoint',
    ],
    edit: ['hash', 'name', 'phone', 'email', 'rate', 'discount', 'attract', 'id'],
    select: ['paymentType', 'paymentWho', 'paymentForm', 'region'],
    date: [],
    text: [],
    actions: ['actions'],
    slot: ['free'],
  }

  public columnSelects = {
    region: regionsSelect,
    paymentType: paymentTypeSelect,
    paymentForm: paymentFormSelect,
    paymentWho: paymentWhoSelect,
  }

  get store() {
    return clientsModule
  }

  getReadableBoolean(bool: boolean) {
    return bool ? 'Да' : 'Нет'
  }

  async updateFree(a: any, b: any, c: any) {
    console.log(a, b, c)
  }

  async onUpdate(id: string | number, data: Record<string, any>) {
    console.log(id, data)

    const field = Object.keys(data)[0]

    if (['freeIn', 'freeOut', 'freeCash', 'freePay', 'freeExtraPoint'].includes(field)) {
      const newField = kebabCase(field).replace('-', '.')
      data[newField] = data[field]
      delete data[field]
    }

    const response = await this.store.updateClient({ id, data })

    if (response) {
      this.$notification.success('Успешное обновление поля')
    } else {
      this.$notification.error('Упс... Что-то пошло не так...')
    }
  }

  async onDelete(payload: Client) {
    const response = await this.store.deleteClient(payload)

    if (response) {
      this.$notification.success('Успешное удаление клиента')
    } else {
      this.$notification.error('Упс... Что-то пошло не так...')
    }
  }
}
</script>
