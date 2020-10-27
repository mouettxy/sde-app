<template lang="pug">
v-card
  v-card-title.secondary
    v-icon(size='1.4rem', color='#181818') mdi-information
    span {{$t("orderPreview.addressInfoTitle")}}
  v-card-text.send-order__info-text(v-if='info')
    v-list-item(two-line, v-if='info.comment')
      v-list-item-content
        v-list-item-title {{$t("addressInfo.commentLabel")}}
        v-list-item-subtitle {{info.comment}}
    v-list-item(two-line, v-if='info.whoPays')
      v-list-item-content
        v-list-item-title {{$t("addressInfo.whoPaysTitle")}}
        v-list-item-subtitle {{info.whoPays}}
    v-list-item(two-line, v-if='info.quick')
      v-list-item-content
        v-list-item-title {{$t("addressInfo.quickLabelText")}}
    v-list-item(two-line, v-if='info.car')
      v-list-item-content
        v-list-item-title {{$t("addressInfo.carLabelText")}}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AddressPreview extends Vue {
  @Prop(Object) info: any
}
</script>
