<template lang="pug">
v-card.order-preview__address
  v-card-title.secondary
    v-icon(size='1.4rem', color='#181818') mdi-map-marker
    span {{address.address}}
  v-card-text(v-if='address')
    v-list-item(two-line, v-if='address.fields && address.fields.phone')
      v-list-item-content
        v-list-item-title {{$t("addressFields.phoneLabel")}}
        v-list-item-subtitle {{address.fields.phone}}
    v-list-item(two-line, v-if='address.fields && address.fields.comment')
      v-list-item-content
        v-list-item-title {{$t("addressFields.commentLabel")}}
        v-list-item-subtitle {{address.fields.comment}}
    v-list-item(two-line, v-if='address.fields && address.fields.datetime')
      v-list-item-content
        v-list-item-title {{$t("addressFields.datetimeLabel")}}
        v-list-item-subtitle {{address.fields.datetime}}
    v-list-item(two-line, v-if='address.fields && address.fields.bundles')
      v-list-item-content
        v-list-item-title {{$t("addressFields.bundlesLabel")}}
        v-list-item-subtitle {{$t("addressFields.bundlesCount")}}: {{address.fields.bundles}}
    v-list-item(two-line, v-if='address.fields && address.fields.buyin')
      v-list-item-content
        v-list-item-title {{$t("addressFields.buyinLabel")}}
        v-list-item-subtitle
          span {{address.fields.buyin}}
          v-icon(size='1rem') mdi-currency-rub
    v-list-item(two-line, v-if='address.fields && address.fields.buyout')
      v-list-item-content
        v-list-item-title {{$t("addressFields.buyoutLabel")}}
        v-list-item-subtitle
          span {{address.fields.buyout}}
          v-icon(size='1rem') mdi-currency-rub
    v-list-item(two-line, v-if='address.fields && address.fields.takeIn')
      v-list-item-content
        v-list-item-title {{$t("addressFields.takeInLabel")}}
    v-list-item(two-line, v-if='address.fields && address.fields.takeOut')
      v-list-item-content
        v-list-item-title {{$t("addressFields.takeOutLabel")}}
    v-list-item(two-line, v-if='address.fields && address.fields.bus')
      v-list-item-content
        v-list-item-title {{$t("addressFields.busLabel")}}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AddressPreview extends Vue {
  @Prop(Object) address: any
}
</script>
