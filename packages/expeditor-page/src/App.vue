<template lang="pug">
v-app
  v-main
    sde-button
</template>

<script>
import ui from '@sde-app/ui'

export default {
  name: 'App',
  components: {
    SdeButton: ui.SdeButton,
  },
}
</script>

<style lang="scss"></style>
