module.exports = {
  pluginOptions: {
    autoRouting: {
      chunkNamePrefix: 'page-',
    },
  },
  transpileDependencies: ['vuetify', '@sde-app/ui'],
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "~@sde-app/ui/src/sass/variables.sass"',
      },
    },
  },
}
