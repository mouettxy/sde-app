import { startsWith } from 'lodash'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Colors extends Vue {
  getAccesibleTextColor(hex: string) {
    function cutHex(h: string) {
      return h.charAt(0) == '#' ? h.substring(1, 7) : h
    }
    function hexToR(h: string) {
      return parseInt(cutHex(h).substring(0, 2), 16)
    }
    function hexToG(h: string) {
      return parseInt(cutHex(h).substring(2, 4), 16)
    }
    function hexToB(h: string) {
      return parseInt(cutHex(h).substring(4, 6), 16)
    }

    const threshold = 133

    const hRed = hexToR(hex)
    const hGreen = hexToG(hex)
    const hBlue = hexToB(hex)

    const cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000

    if (cBrightness > threshold) {
      return '#151515'
    } else {
      return '#fafafa'
    }
  }

  rgba2hex(color: string) {
    const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',')

    const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2]))
      .toString(16)
      .slice(1)}`

    return hex
  }

  getTextColor(color: string) {
    if (color[0] !== '#') {
      const currentTheme = this.$vuetify.theme.themes[this.$vuetify.theme.dark ? 'dark' : 'light']
      for (const key in currentTheme) {
        if (key === color) {
          // @ts-ignore
          return this.getAccesibleTextColor(currentTheme[key])
        }
      }
    }

    if (startsWith(color, 'rgb')) {
      return this.getAccesibleTextColor(this.rgba2hex(color))
    }

    return this.getAccesibleTextColor(color)
  }

  getIconColor(color: string) {
    if (startsWith(color, 'rgb')) {
      return this.rgba2hex(color)
    }

    return color
  }
}
