<template lang="pug">
.sde-remote-table
  v-toolbar.sde-table__toolbar.mb-2(elevation="1", dense)
    slot(name="toolbar")
    v-spacer
    v-menu(
      v-model='columnsMenu',
      max-height="400px",
      :close-on-content-click='false',
    )
      template(#activator='{ on, attrs }')
        sde-button(v-on='on',
          v-bind='attrs',
          icon) mdi-table-large
      v-card
        v-list(dense)
          v-list-item(
            v-for='(header, i) in headers',
            :key='header.value'
          )
            v-list-item-action
              v-switch(v-model='headers[i]["show"]' @change="changeHeaderVisibility(header.value, headers[i]['show'])")
            v-list-item-title {{ header.text }}
    v-text-field(
      v-model="search"
      @input="onSearch"
      label="Поиск"
      color="dark"
      prepend-inner-icon="mdi-magnify"
      outlined
      hide-details
      dense
    )
  slot(name="toolbar.after")
  v-data-table.elevation-1(
    :server-items-length='totalItems',
    :options.sync='options',
    :no-data-text='noDataText',
    :loading-text='loadingText',
    :loading='isLoading',
    :items='items',
    :item-key='itemKey',
    :headers='headersFormatted',
    @update:sort-desc='onUpdate',
    @update:sort-by='onUpdate',
    @update:page='onUpdate',
    @update:items-per-page='onUpdate',
    multi-sort,
    fixed-header,
    hide-default-footer,
    height='calc(100vh - 205px)'
  )
    template(v-for='(_, slot) of $scopedSlots' v-slot:[slot]='scope')
      slot(:name='slot' v-bind='scope')
  v-pagination.mt-4(
    v-model='options.page',
    :length='Math.round(totalItems / options.itemsPerPage) + 1',
    :current-page='options.page',
    total-visible='9'
    @input="onUpdate"
  )
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'

@Component
export default class SdeRemoteTable extends Vue {
  @Prop({ type: [Object] }) store!: any
  @Prop({ type: String }) noDataText!: string
  @Prop({ type: String }) loadingText!: string
  @Prop({ type: String, default: 'id' }) itemKey!: string

  public columnsMenu = false
  public search = ''
  public searchHelperDebounced = debounce(this.searchHelper, 700)

  get totalItems() {
    return this.store.countRows
  }

  get headers() {
    return this.store.headers
  }

  get headersFormatted() {
    return this.store.headersFormatted
  }

  get isLoading() {
    return this.store.isLoading
  }

  get items() {
    return this.store.itemsNormalized
  }

  get options() {
    return this.store.options
  }

  set options(value) {
    this.store.updateOptions(value)
  }

  changeHeaderVisibility(header: string, value: boolean) {
    this.store.changeHeaderVisibility({ header, value })
  }

  async loadData() {
    await this.store.fetch()
  }

  async onUpdate() {
    this.loadData()
  }

  async searchHelper() {
    this.options = {
      ...this.options,
      search: this.search,
    }
    this.loadData()
  }

  async onSearch() {
    this.searchHelperDebounced()
  }

  async created() {
    await this.loadData()
  }

  async beforeDestroy() {
    await this.store.clearTable()
  }
}
</script>

<style lang="sass">
.sde-remote-table
  .v-data-table__wrapper
    max-width: 100%
    overflow-x: auto !important
    table
      thead
        tr
          white-space: nowrap
  &--loading
    display: flex
    justify-content: center
    height: 100%
    align-items: center
</style>
