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
import { paymentFormSelect, paymentTypeSelect, paymentWhoSelect, regionsSelect } from '@/api/formSelectFields'
import { authModule, clientsModule } from '@/store'

@Component({
  components: {
    VFormBase,
  },
})
export default class ModalCreateClient extends Vue {
  @Ref('form') form!: any

  public modal = false

  public model = {
    id: 0,
    name: '',
    phone: '',
    email: '',
    rate: 0,
    discount: 0,
    paymentType: 'Не указано',
    paymentWho: 'Не указано',
    paymentForm: 'Не указано',
    attract: '',
    food: false,
    free: {
      in: false,
      out: false,
      cash: false,
      pay: false,
      extraPoint: false,
    },
    region: 'Краснодар',
    stopDelivery: false,
    expressDelivery: false,
    alwaysIn: false,
    alwaysOut: false,
  }

  public schema = {
    id: { type: 'number', label: 'ID', col: 6, rules: [required('ID обязательное поле!')] },
    name: { type: 'text', label: 'Имя', col: 6, rules: [required('Имя обязательное поле!')] },
    phone: { type: 'text', label: 'Телефон', col: 6 },
    email: { type: 'text', label: 'Почта', col: 6 },
    rate: { type: 'number', label: 'Тариф', col: 6 },
    discount: { type: 'number', label: 'Скидка', col: 6 },
    paymentType: { type: 'select', label: 'Отсрочка оплаты', col: 3, items: paymentTypeSelect },
    paymentWho: { type: 'select', label: 'Кто платит', col: 3, items: paymentWhoSelect },
    paymentForm: { type: 'select', label: 'Форма оплаты', col: 3, items: paymentFormSelect },
    region: { type: 'select', label: 'Регион', col: 3, items: regionsSelect },
    attract: { type: 'text', label: 'Кто привлёк', col: 12 },
    free: {
      in: { type: 'switch', label: 'Занос', col: 3 },
      out: { type: 'switch', label: 'Вынос', col: 3 },
      cash: { type: 'switch', label: 'Выручка', col: 3 },
      pay: { type: 'switch', label: 'Выкуп', col: 3 },
      extraPoint: { type: 'switch', label: 'Доп. точки', col: 12 },
    },
    food: { type: 'switch', label: 'Еда', col: 3 },
    alwaysIn: { type: 'switch', label: 'Всегда занос', col: 3 },
    alwaysOut: { type: 'switch', label: 'Всегда вынос', col: 3 },
    stopDelivery: { type: 'switch', label: 'Не возим', col: 3 },
    expressDelivery: { type: 'switch', label: 'Приоритетная доставка', col: 12 },
  }

  async onCreate() {
    if (this.form.validate()) {
      // TODO: response
      const response = await clientsModule.createClient(this.model)

      if (response) {
        this.$notification.success('Успешное создание клиента')
      } else {
        this.$notification.error('Упс... Что-то пошло не так...')
      }
    }
  }
}
</script>

<style lang="sass"></style>
