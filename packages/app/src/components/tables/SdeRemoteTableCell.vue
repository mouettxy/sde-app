<template lang="pug">
td.sde-remote-table__cell(v-if='isDisplayed')
  template(v-if='types && edit')
    template(v-if='type === "text"')
      span(:title='columnModel') {{ columnModel }}
    template(v-else-if='type === "select"')
      table-select(
        v-model='columnModel',
        :items='selectItems',
        @change='onChange'
      )
    template(v-else-if='type === "checkbox"')
      table-checkbox(
        v-model='columnModel',
        @change='onChange'
      )
    template(v-else-if='type === "edit"')
      table-edit(
        :value='columnModel',
        @change='onChange'
      )
    template(v-else-if='type === "date"')
      table-date(
        v-model='columnModel',
        :format='dateFormat',
        @change='onChange'
      )
    template(v-else-if='type === "actions"')
      slot(
        :value='columnModel',
        :name='`${columnKey}.edit`',
        :item='item'
      )
        span Слот действий редактирование
    template(v-else-if='type === "slot"')
      slot(
        :value='columnModel',
        :name='`${columnKey}.edit`',
        :item='item'
      )
        span Кастомный слот редактирование

  template(v-else-if='types && !edit')
    template(v-if='type === "text"')
      span(:title='columnModel') {{ columnModel }}
    template(v-else-if='type === "select"')
      span(:title='selectLike') {{ selectLike }}
    template(v-else-if='type === "checkbox"')
      span(:title='booleanLike') {{ booleanLike }}
    template(v-else-if='type === "edit"')
      span(:title='columnModel') {{ columnModel }}
    template(v-else-if='type === "date"')
      span(:title='columnModel') {{ columnModel }}
    template(v-else-if='type === "actions"')
      slot(
        :value='columnModel',
        :name='`${columnKey}.text`',
        :item='item'
      )
        span Слот действий текст
    template(v-else-if='type === "slot"')
      slot(
        :value='columnModel',
        :name='`${columnKey}.text`',
        :item='item'
      )
        span Кастомный слот текст

  template(v-else)
    span(:title='columnModel') {{ columnModel }}
</template>

<script lang="ts">
import { find } from 'lodash'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class SdeRemoteTableCell extends Vue {
  @Prop({ required: true }) column!: any
  @Prop({ type: [String], required: true }) columnKey!: string

  @Prop({ type: Array, required: true }) headers!: Array<any>
  @Prop({ type: Object, required: true }) item!: Record<string, any>

  @Prop({ type: Object }) types!: Record<string, string[]>
  @Prop({ type: Object }) selects!: Record<string, any>
  @Prop({ type: Object }) dates!: Record<string, any>

  @Prop({ type: Boolean, default: false }) edit!: boolean
  @Prop({ type: String, default: 'id' }) updateKey!: string

  get type() {
    for (const type in this.types) {
      if (this.types[type].includes(this.columnKey)) {
        return type
      }
    }

    return 'text'
  }

  get selectItems() {
    return this.selects[this.columnKey]
  }

  get dateFormat() {
    return this.dates[this.columnKey]
  }

  get columnModel() {
    return this.item[this.columnKey]
  }

  set columnModel(value: string | number | boolean | Date) {
    this.$emit('input', value)
  }

  get isDisplayed() {
    const header = find(this.headers, { value: this.columnKey })
    return header && header.show
  }

  get booleanLike() {
    return this.columnModel ? 'Да' : 'Нет'
  }

  get selectLike() {
    return find(this.selectItems, { value: this.columnModel })?.text
  }

  onChange(value: any) {
    this.$emit('change', this.item[this.updateKey], { [this.columnKey]: value })
  }
}
</script>

<style lang="sass">
.sde-remote-table__cell
  white-space: nowrap
</style>
