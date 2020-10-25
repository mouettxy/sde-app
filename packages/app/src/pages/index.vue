<route>
{
  "name": "index",
  "meta": {
    "header": "sde"
  }
}
</route>

<template lang="pug">
.page-index
  h5.text-h5.text-center Добро пожаловать в sde
  h6.text-h6.text-center Страница находится в разработке
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageIndex extends Vue {}
</script>
