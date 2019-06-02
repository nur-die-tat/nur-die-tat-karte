var path = require('path')
var webpackMerge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var commonConfig = require('./common.js')

var root = path.resolve(__dirname, '..')

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: path.join(root, 'dist'),
    publicPath: '/',
    filename: 'js/[name].js'
  },

  plugins: [
    new ExtractTextPlugin('css/[name].css')
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
})
