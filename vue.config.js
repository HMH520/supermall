module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'components': '@/components',
        'common': '@/common',
        'views': '@/views',
        'network': '@/network',
      }
    }
  }
}
