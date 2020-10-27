<template lang="pug">
.user-aliases
  v-autocomplete(
    v-model='value',
    @input='addAlias',
    :color='defaultInputColor',
    :filter='filter',
    :items='aliasList',
    :search-input.sync='query',
    :success-messages='sucMsg',
    hide-no-data,
    type='search',
    item-value='id',
    item-text='name',
    autocomplete='chrome-off',
    :menu-props='menuProps()',
    :label='$t("userFavoriteAliases.searchLabel")'
  )
    template(v-slot:item='data')
      v-list-item-content
        v-list-item-title {{data.item.name}}
        v-list-item-subtitle
          | {{data.item.address}}
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins'
import { addressesModule } from '@/store'
import { map as lodashMap, cloneDeep } from 'lodash'

@Component
export default class UserFavoriteAliases extends Mixins(colors, breakpoints) {
  @Prop(Array) aliases!: Array<any>

  public value: any = null
  public query = ''
  public sucMsg = ''

  get aliasList() {
    return lodashMap(this.aliases, (e, index) => ({
      id: index,
      name: e.name,
      address: e.address
    }))
  }

  menuProps() {
    const defaultProps = {
      closeOnClick: false,
      closeOnContentClick: false,
      disableKeys: true,
      openOnClick: false,
      maxHeight: 304
    } as any

    if (this.isMobile) {
      defaultProps.maxHeight = 130
      defaultProps.top = true
    }
    return defaultProps
  }

  erase(speed = 25) {
    if (this.query) {
      this.query = this.query.substring(0, this.query.length - 1)
      setTimeout(() => {
        this.erase(speed)
      }, speed)
    } else {
      this.value = ''
      this.query = ''
      this.sucMsg = ''
    }
  }

  filter(item: any, queryText: string) {
    return (
      item.name.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1 ||
      item.address.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
    )
  }

  async addAlias() {
    const alias = cloneDeep(this.aliases[this.value])
    const address = { ...alias, isAlias: true, completed: false }
    const status = await addressesModule.add(address)

    if (status) {
      this.sucMsg = this.$t('userFavoriteAliases.successNotification') as string
      this.$notification.success(this.$t('userFavoriteAliases.successNotification') as string)
      setTimeout(() => {
        this.erase()
      }, 1500)
    }
  }
}
</script>
