var _           = require('lodash'),
    webpack     = require('webpack')

    baseConfig  = require('./webpack.config')

module.exports = _.merge(baseConfig, {
  output: {
    filename: 'selectr.debug.js'
  },

  devtool: 'eval-source-map',
  debug: true
})