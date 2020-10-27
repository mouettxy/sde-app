import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Colors extends Vue {
  get isDark() {
    return this.$vuetify.theme.dark
  }

  get defaultFooterColor() {
    return this.isDark ? 'accent' : 'secondary'
  }

  get defaultAddAddressColor() {
    return this.isDark ? 'primary' : 'dark'
  }

  get defaultInputColor() {
    return this.isDark ? 'primary' : 'dark'
  }

  get defaultTabColor() {
    return this.isDark ? 'dark' : 'light'
  }

  get defaultTabTextColor() {
    return this.isDark ? 'primary' : 'dark'
  }
}
