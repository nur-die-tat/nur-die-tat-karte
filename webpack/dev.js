var path = require('path');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
var commonConfig = require('./common.js');

var root = path.resolve(__dirname, '..');

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
      'vendor/proj4/proj4.js',
      'vendor/openlayers/ol.css',
      'vendor/openlayers/ol-debug.js',
      'vendor/bootstrap/css/bootstrap.min.css',
      'vendor/jquery/jquery.min.js',
      'vendor/tether/js/tether.min.js',
      'vendor/bootstrap/js/bootstrap.min.js'
    ], append: false })
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});