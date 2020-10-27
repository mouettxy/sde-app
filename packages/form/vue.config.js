/* eslint-disable @typescript-eslint/camelcase */
module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  pwa: {
    manifestOptions: {
      name: 'Заявка на доставку sde',
      short_name: 'Доставка sde',
      display: 'fullscreen',
      startUrl: 'https://api.sde.ru.com/test/',
      msTileColor: '#000000',
      theme_color: '#C79C00',
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'black'
    }
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.(js | ts | vue)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            fix: true,
            formatter: 'prettier'
          }
        }
      ]
    }
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/variables.sass"'
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    },
    moment: {
      locales: ['ru', 'en']
    }
  }
}
