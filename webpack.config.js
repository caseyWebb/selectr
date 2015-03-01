var path    = require('path'),
    webpack = require('webpack')

module.exports = {
  entry: './src/selectr.coffee',
  
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'selectr.js',
    library: 'selectr',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      
      { test: /\.coffee$/,
        loader: 'coffee' },
      
      { test: /\.scss$/,
        loader: 'style!css!autoprefixer!sass?outputStyle=compressed' }
    ]
  },

  externals: {
    'jquery': 'jQuery'
  },

  plugins: [
    new webpack.DefinePlugin({
      NO_STYLES: false,
      POLYFILL_BOOTSTRAP_STYLES: false
    })
  ]
}