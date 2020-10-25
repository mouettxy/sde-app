<template lang="pug">
base-modal(v-model='modal')
  template(#activator='{on, attrs}')
    slot(
      name='activator',
      :on='on',
      :attrs='attrs'
    )
  template(#default='{close}')
    v-card
      sde-toolbar(
        title='Новый пользователь',
        color='primary'
      )
        sde-button(
          @click='close',
          icon
        ) mdi-close
      v-card-text.mt-4
        v-form(
          ref='form',
          @submit.prevent='onCreate'
        )
          v-form-base(
            :schema='schema',
            :model='model'
          )
          sde-button(
            @click.prevent='onCreate',
            type='submit',
            color='primary'
          ) Создать
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { required } from '@/api/formValidators'
import VFormBase from 'vuetify-form-base'
import { regionsSelect, userPermissionsSelect, userRolesSelect, userTransportSelect } from '@/api/formSelectFields'
import { authModule } from '@/store'

@Component({
  components: {
    VFormBase,
  },
})
export default class ModalCreateUser extends Vue {
  @Ref('form') form!: any

  public modal = false
  public model = {
    username: '',
    password: '',
    comment: '',
    phone: '',
    email: '',
    credentials: '',
    active: false,
    canTakeOrders: false,
    workTime: '',
    role: 'expeditor',
    transport: 'moto',
    region: 'Краснодар',
    permissionsLevel: 3,
    isSdeTransport: true,
  }

  public schema = {
    username: { type: 'text', label: 'Никнейм', col: 12, rules: [required('Никнейм обязательное поле!')] },
    password: {
      type: 'password',
      label: 'Пароль',
      clearable: true,
      col: 12,
      rules: [required('Пароль обязательное поле!')],
    },
    comment: { type: 'text', label: 'Комментарий', col: 12 },
    phone: { type: 'text', label: 'Телефон', col: 6, rules: [required('Телефон обязательное поле!')] },
    email: { type: 'text', label: 'Почта', col: 6 },
    credentials: { type: 'text', label: 'ФИО', col: 12, rules: [required('ФИО обязательное поле!')] },
    active: { type: 'switch', label: 'Активность', col: 4 },
    isSdeTransport: { type: 'switch', label: 'Транспорт sde', col: 4 },
    canTakeOrders: { type: 'switch', label: 'Может брать заявки', col: 4 },
    workTime: { type: 'text', label: 'Рабочее время', col: 12 },
    role: { type: 'select', label: 'Должность', items: userRolesSelect, col: 6 },
    transport: { type: 'select', label: 'Транспорт', items: userTransportSelect, col: 6 },
    region: { type: 'select', label: 'Регион', items: regionsSelect, col: 6 },
    permissionsLevel: { type: 'select', label: 'Уровень прав', items: userPermissionsSelect, col: 6 },
  }

  async onCreate() {
    if (this.form.validate()) {
      const response = await authModule.register(this.model)

      if (response) {
        this.$notification.success('Успешное создание пользователя')
        this.modal = false
      } else {
        this.$notification.error('Упс... Что-то пошло не так...')
      }
    }
  }
}
</script>

<style lang="sass"></style>
