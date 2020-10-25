<route>
{
  "name": "logistUsers",
  "meta": {
    "header": "Пользователи"
  }
}
</route>

<template lang="pug">
.page-logist-users
  sde-remote-table(
    :store='store',
    no-data-text='Не удалось найти пользователей',
    loading-text='Загружаем пользователей...',
    item-key='username'
  )
    template(#toolbar)
      sde-button(
        @click='enableInteractive = !enableInteractive',
        icon
      ) mdi-pencil
      modal-create-user
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
            @change='onUpdate',
            update-key='_id'
          )
            template(#actions.edit='{item}')
              sde-button(
                @click='onDelete(item)',
                icon,
                color='error'
              ) mdi-delete
            template(#actions.text)
              span
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { usersModule } from '@/store'
import { User } from '@/typings/user'
import { find } from 'lodash'
import { regionsSelect, userPermissionsSelect, userRolesSelect, userTransportSelect } from '@/api/formSelectFields'

@Component
export default class PageLogistUsers extends Vue {
  public enableInteractive = false

  public columnTypes = {
    checkbox: ['active', 'canTakeOrders', 'isSdeTransport'],
    edit: ['username', 'comment', 'phone', 'email', 'credentials'],
    select: ['role', 'region', 'transport', 'permissionsLevel'],
    date: [],
    text: [],
    actions: ['actions'],
  }

  public columnSelects = {
    transport: userTransportSelect,
    role: userRolesSelect,
    region: regionsSelect,
    permissionsLevel: userPermissionsSelect,
  }

  get store() {
    return usersModule
  }

  async onUpdate(id: string | number, data: Record<string, any>) {
    const response = await usersModule.updateUser({ id, data })

    if (response) {
      this.$notification.success('Успешное обновление поля')
    } else {
      this.$notification.error('Упс... Что-то пошло не так...')
    }
  }

  async onDelete(payload: User) {
    const response = await usersModule.deleteUser(payload)

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
