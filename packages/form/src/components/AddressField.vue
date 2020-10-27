<template lang="pug">
.address-search
  v-autocomplete(
    ref='addressInput',
    v-model='value',
    :success-messages='sucMsg',
    :search-input.sync='query',
    :menu-props='menuProps()',
    :loading='isLoading',
    :label='$t("addressField.label")',
    :items='suggestions',
    :error-messages='errMsg',
    :color='defaultInputColor',
    :hint='$t("addressField.hint")',
    @input='onInput',
    prepend-inner-icon='mdi-map-marker',
    persistent-hint,
    no-filter,
    hide-no-data,
    append-icon='mdi-magnify'
  )
</template>

<script lang="ts">
import { Component, Mixins, Watch, Ref } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins/'
import { addressesApi as api } from '@/api'
import { debounce, map as lodashMap, isNull } from 'lodash'
import { addressesModule } from '@/store'

@Component
export default class AddressField extends Mixins(colors, breakpoints) {
  @Ref('addressInput') addressInput: any
  private debounced: any
  public errMsg = ''
  public sucMsg = ''
  public isLoading: boolean | string = false

  public query: string | null = ''
  public value: any = {}
  public entries: Array<any> = []

  @Watch('query')
  onQueryChange(val: string | null) {
    if (!isNull(val) && val) {
      if (val.length > 3) {
        this.isLoading = 'success'
        this.debounced()
      } else {
        this.errMsg = ''
      }
    }
  }

  get suggestions() {
    if (!this.entries) {
      return []
    }

    const items = lodashMap(this.entries, (entry) => {
      const information = {
        address: entry.value,
        detailedAddress: entry.unrestricted_value,
        usedGeocoder: false,
        geocoderResponse: {},
        suggestion: entry.data,
        lat: entry.data.geo_lat,
        lon: entry.data.geo_lon,
      }
      const address = entry.value
      const suggestion = {
        value: information,
        text: address,
      }
      return Object.assign({}, suggestion)
    })

    return items
  }

  erase(speed = 25) {
    if (this.query) {
      this.query = this.query.substring(0, this.query.length - 1)
      if (this.query.length === 0) {
        this.query = null
        this.value = {}
        this.entries = []
        this.sucMsg = ''
        this.errMsg = ''
      } else {
        setTimeout(() => {
          this.erase(speed)
        }, speed)
      }
    }
  }

  menuProps() {
    const defaultProps = {
      closeOnClick: false,
      closeOnContentClick: false,
      disableKeys: true,
      openOnClick: false,
      maxHeight: 180,
    } as any

    if (this.isMobile) {
      defaultProps.maxHeight = 100
      defaultProps.bottom = true
    }
    return defaultProps
  }

  reset() {
    this.isLoading = false
    this.erase()
  }

  async onInput() {
    this.isLoading = 'warning'

    if (!this.value.suggestion.house) {
      this.errMsg = this.$t('addressField.errorAddressWithoutHome') as string
      this.$notification.error(this.$t('addressField.errorAddressWithoutHome') as string)
      return
    }
    if (!this.value.suggestion.geo_lat || !this.value.suggestion.geo_lon) {
      const response = await api.getLatLon(this.value.detailedAddress)
      if (response) {
        this.value = {
          ...this.value,
          ...response,
        }
      } else {
        this.reset()
        this.errMsg = this.$t('addressField.errorCannotGeocodeAddress') as string
        this.$notification.error(this.$t('addressField.errorCannotGeocodeAddress') as string)
      }
    }

    const address = {
      ...this.value,
      isAlias: false,
      completed: false,
    }

    const status = await addressesModule.add(address)

    if (status) {
      this.sucMsg = this.$t('addressField.addressAdded') as string
      this.$notification.success(this.$t('addressField.addressAdded') as string)
      this.$emit('selected')
      setTimeout(() => {
        this.reset()
      }, 1000)
    } else {
      this.errMsg = this.$t('addressField.errorAddressAdd') as string
      this.$notification.error(this.$t('addressField.errorAddressAdd') as string)
    }
  }

  async getSuggestions() {
    this.isLoading = true
    const response = await api.getSuggestions(this.query as string)
    if (response) {
      this.entries = response
    } else {
      this.errMsg = this.$t('addressField.errorOnSuggestionsFetch') as string
      this.$notification.error(this.$t('addressField.errorOnSuggestionsFetch') as string)
    }
    this.isLoading = false
  }

  mounted() {
    this.debounced = debounce(this.getSuggestions, 200)
  }
}
</script>

<style lang="sass">
.address-search
  padding: 12px
  .notranslate
    transform: none !important
</style>
