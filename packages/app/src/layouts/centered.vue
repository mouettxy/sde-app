<template lang="pug">
.layout-centered
  router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class LayoutCentered extends Vue {}
</script>

<style lang="sass">
.layout-centered
  position: relative
  display: flex
  height: 100%
  align-content: center
  justify-content: center
</style>
