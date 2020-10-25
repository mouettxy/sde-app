<template lang="pug">
v-progress-circular(
  indeterminate,
  color='black'
)
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BaseSpinner extends Vue {}
</script>

<style lang="sass"></style>
