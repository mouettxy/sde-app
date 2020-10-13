<template lang="pug">
v-navigation-drawer.sde-drawer(
  permanent,
  clipped,
  app
)
  template(v-if='menu')
    sde-list(group)
      template(v-for='(m, i) in menu')
        sde-list-item(
          :title='m.title',
          :icon='m.icon',
          :action='m.action'
        )
</template>

<script>
export default {
  name: 'SdeDrawer',
  props: {
    menu: Array,
  },
}
</script>
