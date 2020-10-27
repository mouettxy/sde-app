<template lang="pug">
.user-addresses
  v-autocomplete(
    v-model='value',
    @input='addOrder',
    :color='defaultInputColor',
    :filter='filter',
    :items='addressList',
    :search-input.sync='query',
    :success-messages='sucMsg',
    hide-no-data,
    item-value='id',
    item-text='name',
    type='search',
    autocomplete='chrome-off',
    :menu-props='menuProps()',
    :label='$t("userFavoriteAddresses.searchLabel")'
  )
    template(v-slot:item='data')
      v-list-item-content
        v-list-item-title {{data.item.name}}
        template(v-if='!isMobile')
          v-list-item-subtitle.ml-2
            span(v-html='data.item.addresses').grey--text
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins'
import { addressesModule } from '@/store'
import { map as lodashMap } from 'lodash'

@Component
export default class UserFavoriteAddresses extends Mixins(colors, breakpoints) {
  @Prop(Array) addresses!: Array<any>

  public value: any = null
  public query = ''
  public sucMsg = ''

  get addressList() {
    const getTrimmedAddressList = (addressList: Array<any>) => {
      return `${addressList[0].address}<br>...<br>${addressList[addressList.length - 1].address}`
    }
    return lodashMap(this.addresses, (e, index) => ({
      id: index,
      name: e.name,
      addresses: getTrimmedAddressList(e.addressList)
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
    return item.name.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
  }

  async addOrder() {
    const status = await addressesModule.addOrder(this.addresses[this.value])

    if (status) {
      this.sucMsg = this.$t('userFavoriteAddresses.successNotification') as string
      this.$notification.success(this.$t('userFavoriteAddresses.successNotification') as string)
      setTimeout(() => {
        this.erase()
      }, 1500)
    }
  }
}
</script>
