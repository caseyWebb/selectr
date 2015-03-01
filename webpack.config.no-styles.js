var _           = require('lodash'),
    webpack     = require('webpack')

    baseConfig  = require('./webpack.config')

module.exports = _.merge(baseConfig, {
  output: {
    filename: 'selectr.no-styles.js'
  },

  plugins: [
    new webpack.DefinePlugin({
      NO_STYLES: true
    })
  ]
})