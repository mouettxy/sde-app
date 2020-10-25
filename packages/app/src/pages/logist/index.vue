<route>
{
  "name": "logistIndex",
  "meta": {
    "header": "Рабочий стол"
  }
}
</route>

<template lang="pug">
.page-logist-index
  span page logist index
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageLogistIndex extends Vue {}
</script>
