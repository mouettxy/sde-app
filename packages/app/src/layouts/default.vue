<template lang="pug">
.layout-default
  router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class LayoutDefault extends Vue {}
</script>

<style lang="sass">
.layout-default
  height: inherit
</style>
