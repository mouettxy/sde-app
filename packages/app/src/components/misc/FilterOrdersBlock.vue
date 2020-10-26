<template lang="pug">
v-card(elevation='1')
  v-card-text
    v-row
      v-col(cols='2')
        v-select(
          v-model='filter.status',
          :items='customStatusSelect',
          label='Статус',
          hide-details,
          dense
        )
</template>

<script lang="ts">
import { statusSelect } from '@/api/formSelectFields'
import { ordersModule } from '@/store'
import { find } from 'lodash'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class FilterOrdersBlock extends Vue {
  public filter = {
    status: 'Новые',
  }

  public customStatusSelect = [
    ...statusSelect,
    { text: 'Любой', value: 'Любой' },
    { text: 'Новые', value: 'Новые' },
    { text: 'Закрытые', value: 'Закрытые' },
  ]

  @Watch('filter', { deep: true })
  onFilterChange(value: any) {
    this.$emit('change', value)
  }
}
</script>

<style lang="sass"></style>
