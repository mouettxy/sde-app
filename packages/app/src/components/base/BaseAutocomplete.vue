<template lang="pug">
v-autocomplete(
  v-model='model',
  :search-input.sync='query',
  :return-object='returnObject',
  :prepend-inner-icon='icon',
  :label='label',
  :items='items',
  :hide-details='hideDetails',
  :disabled='disabled',
  :dense='dense',
  @focus.stop='onAutocompleteFocus',
  no-filter,
  no-data-text='Нет доступных данных',
  item-value='value',
  item-text='text',
  hide-no-data,
  clearable,
  auto-select-first
)
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

import { isEmpty } from 'lodash'

@Component
export default class AAutocomplete extends Vue {
  @Prop({ type: [String, Object, Number] }) value: any
  @Prop({ type: Boolean, default: false }) disabled!: boolean
  @Prop({ type: Object }) uriQuery!: Record<string, any>
  @Prop(String) label: any
  @Prop(String) endpoint: any
  @Prop(String) replaceSearchWith: any
  @Prop(Boolean) dense: any
  @Prop(String) icon: any
  @Prop(Array) predefinedItems: any
  @Prop(Boolean) returnObject!: boolean
  @Prop(Boolean) hideDetails!: boolean

  public items: Array<any> = []
  public query = ''

  @Watch('query')
  async onValueChange() {
    if (this.query) {
      const items = await this.getItems()

      this.items = items

      if (isEmpty(this.items)) {
        this.items.push({ value: this.query, text: this.query })
      }
    }
  }

  async onAutocompleteFocus() {
    this.items = await this.getItems()
  }

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }

  async getItems() {
    try {
      let params = {
        search: this.query,
      }

      if (this.uriQuery) {
        params = {
          ...params,
          ...this.uriQuery,
        }
      }

      if (this.replaceSearchWith) {
        params.search = this.replaceSearchWith
      }

      const response = await this.$axios.get(`autocomplete${this.endpoint}`, { params })

      if (response.status === 200) {
        return response.data
      } else {
        return []
      }
    } catch (e) {
      return []
    }
  }

  mounted() {
    if (this.predefinedItems) {
      this.items = this.predefinedItems
    }
  }
}
</script>
