<template lang="pug">
.sde-list-item
  v-list-item.sde-list-item__content(
    @click='onClick',
    dense
  )
    v-list-item-icon(v-if='icon')
      v-icon {{ icon }}
    v-list-item-content
      v-list-item-title(v-if='title') {{ title }}
      v-list-item-subtitle(v-if='subtitle') {{ subtitle }}
      v-list-item-subtitle(v-if='message') {{ message }}
  template(v-if='divider')
    v-divider
</template>

<script>
export default {
  name: 'SdeListItem',
  props: {
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    message: {
      type: String,
    },
    icon: {
      type: String,
    },
    divider: {
      type: Boolean,
      default: true,
    },
    action: {
      type: [String, Object, Function],
    },
  },
  computed: {
    parsedAction() {
      const action = {}

      console.log(typeof this.action)

      if (typeof this.action === 'string' || typeof this.action === 'object') {
        action.to = this.action
      }

      if (typeof this.action === 'function') {
        action.click = this.action
      }

      return action
    },
  },
  methods: {
    onClick(evt) {
      console.log(this.parsedAction)
      if (this.parsedAction.to) {
        this.$router.push(this.parsedAction.to)
      } else if (this.parsedAction.click) {
        this.action()
      } else {
        console.log(this.parsedAction)
      }
    },
  },
}
</script>
