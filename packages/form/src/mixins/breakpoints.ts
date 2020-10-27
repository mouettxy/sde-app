import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Breakpoints extends Vue {
  get isMobile() {
    return this.$vuetify.breakpoint.xl || this.$vuetify.breakpoint.lg || this.$vuetify.breakpoint.md ? false : true
  }

  get breakpoints() {
    const a = this.$vuetify.breakpoint
    return {
      xl: a.xl,
      lg: a.lg,
      md: a.md,
      sm: a.sm,
      xs: a.xs
    }
  }
}
