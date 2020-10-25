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
              single-line,
              label='Дата открытия',
              hide-details,
              dense
            )
          template(#icon-calendar)
            span
      v-col
        span Курьер
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

@Component({
  components: {
    DatePicker,
  },
})
export default class CopyOrdersBlock extends Vue {
  public model = {
    status: 'Любая',
    dateFrom: [moment().toDate(), moment().toDate()],
    dateTo: [moment().toDate(), moment().toDate()],
  }

  public customStatusSelect = [...statusSelect, { text: 'Любая', value: 'Любая' }]

  onSubmit() {
    console.log(this.model)
  }
}
</script>

<style lang="sass"></style>
