const path = require('path')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./common.js')

const root = path.resolve(__dirname, '..')

module.exports = webpackMerge(commonConfig, {
  mode: 'production',

  devtool: 'source-map',

  output: {
    path: path.join(root, 'dist'),
    publicPath: '/',
    filename: 'js/[name].[contenthash].js'
  }
})
