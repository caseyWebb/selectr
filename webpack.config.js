var _             = require('lodash'),
    path          = require('path'),
    webpack       = require('webpack'),
    precss        = require('precss'),
    autoprefixer  = require('autoprefixer')

const baseConfig = {
  entry: './src/selectr.coffee',

  output: {
    path: path.join(__dirname, 'dist'),
    library: 'selectr',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test: /\.coffee$/,
        loader: 'coffee'
      },

      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass']
      }
    ]
  },

  postcss() {
    return [precss, autoprefixer]
  },

  externals: {
    jquery: {
      root: '$',
      amd: 'jquery',
      commonjs: 'jquery',
      commonjs2: 'jquery'
    }
  },

  devtool: 'source-map'
}

module.exports = [
  _.merge({}, baseConfig, {
    output: {
      filename: 'selectr.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin()
    ]
  }),
  _.merge({}, baseConfig, {
    output: {
      filename: 'selectr.debug.js'
    },
    debug: true
  }),
  _.merge({}, baseConfig, {
    output: {
      filename: 'selectr.no-styles.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        NO_STYLES: true
      }),
      new webpack.optimize.UglifyJsPlugin()
    ]
  }),
  _.merge({}, baseConfig, {
    output: {
      filename: 'selectr.bs-polyfilled.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        POLYFILL_BOOTSTRAP_STYLES: true
      }),
      new webpack.optimize.UglifyJsPlugin()
    ]
  })
]
