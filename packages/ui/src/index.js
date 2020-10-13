function requireComponents(req, VueInstance) {
  for (const key of req.keys()) {
    const name = /(\w*)\.(vue)$/g.exec(key)

    if (name) {
      VueInstance.component(name[1], req(key).default)
    }
  }
}

export default {
  install(Vue, options) {
    let req = require.context('./components', true, /\.(vue)$/i)

    if (module.hot) {
      module.hot.accept(req.id, () => {
        req = require.context('./components', true, /\.(vue)$/i)
      })
    }

    requireComponents(req, Vue)
  },
}
