<template lang="pug">
v-scroll-y-transition
  v-card.user-favorite.elevation-3(v-if='aliases.length > 0 || addresses.length > 0')
    v-tabs(
      :vertical='!isMobile',
      :color='defaultTabTextColor',
      :background-color='defaultTabColor',
      show-arrows,
      prev-icon='mdi-icon-left',
      next-icon='mdi-icon-right',
      grow
    )
      v-tab#tour-aliases(v-if='aliases') {{ $t("addresses") }}
      v-tab#tour-addresses(v-if='addresses') {{ $t("orders") }}
      v-tab-item.saved-data__addresses.pa-8(v-if='aliases')
        user-favorite-aliases(:aliases='aliases')
      v-tab-item.pa-8(v-if='addresses')
        user-favorite-addresses(:addresses='addresses')
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { colors, breakpoints } from '@/mixins/'
import { authModule } from '@/store'

import UserFavoriteAddresses from '@/components/UserFavoriteAddresses.vue'
import UserFavoriteAliases from '@/components/UserFavoriteAliases.vue'

@Component({
  components: {
    UserFavoriteAddresses,
    UserFavoriteAliases,
  },
})
export default class UserFavorite extends Mixins(colors, breakpoints) {
  get aliases() {
    if (!authModule.user || typeof authModule.user === 'string') {
      return false
    }

    return authModule.user.addresess
  }

  get addresses() {
    if (!authModule.user || typeof authModule.user === 'string') {
      return false
    }

    return authModule.user.orders
  }
}
</script>

<style lang="sass">
.user-favorite
  margin-top: 12px
</style>
