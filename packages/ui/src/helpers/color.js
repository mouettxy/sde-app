export function getTextColor(hex) {
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
}

export function rgba2hex(color) {
  const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',')

  const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2]))
    .toString(16)
    .slice(1)}`

  return hex
}
