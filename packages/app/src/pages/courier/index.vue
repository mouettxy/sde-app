<route>
{
  "name": "courierIndex",
  "meta": {
    "header": "Рабочий стол"
  }
}
</route>

<template lang="pug">
.page-logist-index
  span page courier index
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageCourierIndex extends Vue {}
</script>
