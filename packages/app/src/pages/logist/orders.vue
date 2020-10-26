<route>
{
  "name": "logistOrders",
  "meta": {
    "header": "Заявки"
  }
}
</route>

<template lang="pug">
.page-logist-users
  sde-remote-table(
    :store='store',
    no-data-text='Не удалось найти заявки',
    loading-text='Загружаем заявки...',
    item-key='id'
  )
    template(#toolbar)
      sde-button(
        @click='enableInteractive = !enableInteractive',
        icon
      ) mdi-pencil
      sde-button(
        @click='showCopyToolbar = !showCopyToolbar',
        icon
      ) mdi-clipboard-text-multiple
      sde-button(
        @click='showFilterToolbar = !showFilterToolbar',
        icon
      ) mdi-filter

    template(#toolbar.after)
      v-slide-y-transition
        filter-orders-block.mb-2(
          v-if='showFilterToolbar',
          @change='onFilterChange'
        )
      v-slide-y-transition
        copy-orders-block.mb-2(v-if='showCopyToolbar')

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
            :dates='datesFormats',
            :column-key='key',
            :column='column',
            @change='onUpdate'
          )
            template(#actions.edit='{item}')
              sde-button(
                @click='onCopy(item.id)',
                icon,
                color='success'
              ) mdi-clipboard-text
            template(#actions.text)
              sde-button(
                @click='onCopy(item.id)',
                icon,
                color='success'
              ) mdi-clipboard-text
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ordersModule, usersModule } from '@/store'
import { User } from '@/typings/user'
import { find, map } from 'lodash'
import {
  paymentFormSelect,
  paymentTypeSelect,
  paymentWhoSelect,
  regionsSelect,
  userPermissionsSelect,
  userRolesSelect,
  userTransportSelect,
  statusSelect,
} from '@/api/formSelectFields'
import { Order } from '@/typings/order'

@Component
export default class PageLogistOrders extends Vue {
  public enableInteractive = false
  public showCopyToolbar = false
  public showFilterToolbar = false

  public columnTypes = {
    checkbox: ['express', 'payed'],
    edit: [
      'clientId',
      'clientName',
      'clientPhone',
      'clientRate',
      'logist',
      'timeInTravel',
      'promocode',
      'discount',
      'debt',
      'comment',
      'additionals',
      'mileage',
      'buyin',
      'total',
      'totalDiscounted',
      'totalAdditionals',
    ],
    select: ['status', 'transport', 'region', 'paymentWho', 'paymentForm', 'paymentType'],
    date: ['date', 'orderTime', 'orderFromTime', 'orderToTime'],
    text: ['id', 'month', 'to', 'from', 'courier', 'courierCredentials'],
    actions: ['actions'],
  }

  public columnSelects = {
    status: statusSelect,
    transport: userTransportSelect,
    region: regionsSelect,
    paymentWho: paymentWhoSelect,
    paymentForm: paymentFormSelect,
    paymentType: paymentTypeSelect,
  }

  public datesFormats = {
    date: 'DD.MM.YYYY',
    orderTime: 'HH:mm',
    orderFromTime: 'DD.MM.YYYY HH:mm',
    orderToTime: 'DD.MM.YYYY HH:mm',
  }

  get store() {
    return ordersModule
  }

  async onFilterChange(value: any) {
    const enrichedFilter = map(value, (e, key) => {
      if (key === 'status') {
        let status = e
        if (status === 'Любой') {
          status = ['Новая', 'В работе', 'Закрыта', 'Не состоялась']
        } else if (status === 'Новые') {
          status = ['Новая', 'В работе']
        } else if (status === 'Закрытые') {
          status = ['Закрыта', 'Не состоялась']
        } else {
          status = [status]
        }

        return { type: 'in', key: 'status', value: status }
      }
    })
    await this.store.updateOptions({
      ...this.store.options,
      filter: enrichedFilter,
    })
    await this.store.fetch()
  }

  async onCopy(id: string | number) {
    const response = await this.store.copyOne(id)

    if (response) {
      try {
        const isCopied = await navigator.clipboard.writeText(response)
        this.$notification.success('Успешное скопирована заявка ' + id)
      } catch (error) {
        this.$notification.error('[Клиент] Упс... Что-то пошло не так...')
      }
    } else {
      this.$notification.error('[Сервер] Упс... Что-то пошло не так...')
    }
  }

  async onUpdate(id: string | number, data: Record<string, any>) {
    const response = await this.store.updateOrder({ id, data })

    if (response) {
      this.$notification.success('Успешное обновление поля')
    } else {
      this.$notification.error('Упс... Что-то пошло не так...')
    }
  }

  async onDelete(payload: Order) {
    const response = await this.store.deleteOrder(payload.id)

    if (response) {
      this.$notification.success('Успешное удаление пользователя')
    } else {
      this.$notification.error('Упс... Что-то пошло не так...')
    }
  }
}
</script>

<style lang="sass">
.page-logist-users
  height: 100%
</style>
