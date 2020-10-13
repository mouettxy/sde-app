<route>
{
  "name": "index",
  "meta": {
    "header": "sde"
  }
}
</route>

<template lang="pug">
v-main
  span index page
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageIndex extends Vue {}
</script>
