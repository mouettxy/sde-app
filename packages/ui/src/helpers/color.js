import { startsWith } from 'lodash'

export default {
  methods: {
    getAccesibleTextColor(hex) {
      function cutHex(h) {
        return h.charAt(0) == '#' ? h.substring(1, 7) : h
      }
      function hexToR(h) {
        return parseInt(cutHex(h).substring(0, 2), 16)
      }
      function hexToG(h) {
        return parseInt(cutHex(h).substring(2, 4), 16)
      }
      function hexToB(h) {
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
    },
    rgba2hex(color) {
      const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',')

      const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2]))
        .toString(16)
        .slice(1)}`

      return hex
    },
    getTextColor(color) {
      if (color[0] !== '#') {
        const currentTheme = this.$vuetify.theme.themes[this.$vuetify.theme.isDark ? 'dark' : 'light']
        for (const key in currentTheme) {
          if (key === color) {
            return this.getAccesibleTextColor(currentTheme[key])
          }
        }
      }

      if (startsWith(color, 'rgb')) {
        return this.getAccesibleTextColor(this.rgba2hex(color))
      }

      return this.getAccesibleTextColor(color)
    },
    getIconColor(color) {
      if (startsWith(color, 'rgb')) {
        return this.rgba2hex(color)
      }

      return color
    },
  },
}
