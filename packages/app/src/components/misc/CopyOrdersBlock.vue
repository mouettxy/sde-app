<template lang="pug">
v-card(elevation='1')
  v-card-text
    v-row
      v-col
        v-select(
          v-model='model.status',
          :items='customStatusSelect',
          label='Статус',
          hide-details,
          dense
        )
      v-col
        date-picker(
          v-model='model.dateFrom',
          :clearable='false',
          value-type='date',
          type='date',
          range,
          format='DD.MM.YYYY'
        )
          template(#input='{ props }')
            sde-input(
              v-model='props.value',
              @click-clear='model.dateFrom = null',
              single-line,
              label='Дата открытия',
              hide-details,
              dense
            )
          template(#icon-calendar)
            span
      v-col
        base-autocomplete(
          v-model='model.courier',
          label='Курьер',
          hide-details,
          endpoint='/order-couriers',
          dense
        )
      v-col
        date-picker(
          v-model='model.dateTo',
          :clearable='false',
          value-type='date',
          type='date',
          range,
          format='DD.MM.YYYY'
        )
          template(#input='{ props }')
            sde-input(
              v-model='props.value',
              @click-clear='model.dateTo = null',
              single-line,
              label='Дата закрытия',
              hide-details,
              dense
            )
          template(#icon-calendar)
            span
      v-col
        sde-button(
          @click='onSubmit',
          color='primary'
        ) Скопировать
</template>

<script lang="ts">
import { statusSelect } from '@/api/formSelectFields'
import { Component, Vue } from 'vue-property-decorator'
import DatePicker from 'vue2-datepicker'
import '@/sass/vue2-datepicker.sass'
import 'vue2-datepicker/locale/ru'
import moment from 'moment'
import { cloneDeep, each } from 'lodash'
import { ordersModule } from '@/store'

@Component({
  components: {
    DatePicker,
  },
})
export default class CopyOrdersBlock extends Vue {
  public model: any = {
    status: 'Любой',
    dateFrom: [moment().toDate(), moment().toDate()],
    dateTo: [moment().toDate(), moment().toDate()],
    courier: '',
  }

  public customStatusSelect = [
    ...statusSelect,
    { text: 'Любой', value: 'Любой' },
    { text: 'Новые', value: 'Новые' },
    { text: 'Закрытые', value: 'Закрытые' },
  ]

  async onSubmit() {
    const model = cloneDeep(this.model)
    if (model.dateFrom) {
      model.dateFrom[0] = moment(model.dateFrom[0], 'DD.MM.YYYY').startOf('day').toISOString()
      model.dateFrom[1] = moment(model.dateFrom[1], 'DD.MM.YYYY').endOf('day').toISOString()
    }

    if (model.dateTo) {
      model.dateTo[0] = moment(model.dateTo[0], 'DD.MM.YYYY').startOf('day').toISOString()
      model.dateTo[1] = moment(model.dateTo[1], 'DD.MM.YYYY').endOf('day').toISOString()
    }

    try {
      const response = await ordersModule.copyMany(model)

      if (response) {
        try {
          const isCopied = await navigator.clipboard.writeText(response)
          this.$notification.success('Заявки успешно скопированы')
        } catch (error) {
          this.$notification.error('[Клиент] Упс... Что-то пошло не так при копировании заявок...')
        }
      } else {
        this.$notification.error('[Клиент] Не удалось найти заявки по запросу...')
      }
    } catch (error) {
      this.$notification.error('[Сервер] Ошибка >500')
    }
  }
}
</script>

<style lang="sass"></style>
