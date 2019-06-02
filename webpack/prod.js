var path = require('path')
var webpack = require('webpack')
var webpackMerge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
var commonConfig = require('./common.js')

var root = path.resolve(__dirname, '..')

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: path.join(root, 'dist'),
    publicPath: '/',
    filename: 'js/[name].js'
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),
    new ExtractTextPlugin('css/[name].css'),
    new HtmlWebpackIncludeAssetsPlugin({ assets: [
      'vendor/jquery/jquery.min.js'
    ],
    append: false })
  ]
})
