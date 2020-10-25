<template lang="pug">
tr.sde-remote-table__row
  slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class SdeRemoteTableCell extends Vue {
  @Prop({ type: Object, required: true }) item!: any
}
</script>

<style lang="sass"></style>
