var path = require('path')
var webpackMerge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
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
    new ExtractTextPlugin('css/[name].css'),
    new HtmlWebpackIncludeAssetsPlugin({ assets: [
      'vendor/jquery/jquery.min.js'
    ],
    append: false })
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
})
