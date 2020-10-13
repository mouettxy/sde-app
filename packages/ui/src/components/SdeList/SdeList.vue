<template lang="pug">
v-list.sde-list
  template(v-if='group')
    v-list-item-group
      slot(name='default')
  template(v-else)
    slot(name='default')
</template>

<script>
export default {
  name: 'SdeList',
  props: {
    group: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
