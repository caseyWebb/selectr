var _           = require('lodash'),
    webpack     = require('webpack')

    baseConfig  = require('./webpack.config')

module.exports = _.merge(baseConfig, {
  output: {
    filename: 'selectr.bs-polyfilled.js'
  },

  plugins: [
    new webpack.DefinePlugin({
      POLYFILL_BOOTSTRAP_STYLES: true
    })
  ]
})