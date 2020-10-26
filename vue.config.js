const path = require('path')

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('thejs')
      .test(/\.js$/)
      .include
      .add(path.resolve('src'))
      .add(path.resolve('node_modules/element-ui/packages'))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .end()
  },
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
        'assets': '@/assets',
        'api': '@/api',
        'views': '@/views',
        'store': '@/store',
        'common': '@/common',
        'utils': '@/utils'
      }
    }
  },
  assetsDir: 'static'
}
