// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "~@/assets/scss/variables.scss";',
      },
    },
  },
  publicPath: '/check-coins',
  outputDir: 'docs',
}
