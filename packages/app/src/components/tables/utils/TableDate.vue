<template lang="pug">
date-picker(
  v-model='model',
  :type='type',
  :format='format',
  :clearable='false',
  value-type='date',
  placeholder='Дата'
)
  template(#input='{ props }')
    sde-input(
      v-model='props.value',
      single-line,
      hide-details,
      dense
    )
  template(#icon-calendar)
    span
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DatePicker from 'vue2-datepicker'
import '@/sass/vue2-datepicker.sass'
import 'vue2-datepicker/locale/ru'
import moment from 'moment'

@Component({
  components: {
    DatePicker,
  },
})
export default class TableDate extends Vue {
  @Prop({ type: [String, Date] }) value!: string | Date
  @Prop({ type: String }) format!: string

  get model() {
    return moment(this.value, this.format).toDate()
  }

  set model(value) {
    this.$emit('input', value)
    this.$emit('change', value)
  }

  get type() {
    return this.format === 'HH:mm' ? 'time' : 'datetime'
  }
}
</script>

<style lang="sass"></style>
