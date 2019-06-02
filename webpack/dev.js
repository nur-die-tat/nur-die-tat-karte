const path = require('path')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./common.js')

const root = path.resolve(__dirname, '..')

module.exports = webpackMerge(commonConfig, {
  mode: 'development',

  devtool: 'cheap-module-eval-source-map',

  output: {
    path: path.join(root, 'dist'),
    publicPath: '/',
    filename: 'js/[name].js'
  },

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
})
