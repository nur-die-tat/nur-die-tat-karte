var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var _root = path.resolve(__dirname, '..');

module.exports = {
  entry: {
    'app': './src/main.js'
  },

  resolve: {
    extensions: ['.js']
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        loader: 'file-loader?name=images/[name].[ext]'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap'})
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }
      }
    ]
  },

  externals: {
    jquery: 'jQuery',
    openlayers: 'ol',
    proj4: 'proj4'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'images/favicon.ico'
    }),
    new CopyWebpackPlugin([
      {from: 'node_modules/bootstrap/dist', to: 'vendor/bootstrap'},
      {from: 'node_modules/tether/dist', to: 'vendor/tether'},
      {from: 'node_modules/jquery/dist', to: 'vendor/jquery'},
      {from: 'node_modules/openlayers/dist', to: 'vendor/openlayers'},
      {from: 'node_modules/proj4/dist', to: 'vendor/proj4'},
      {from: 'images', to: 'images'},
      {from: 'layers', to: 'layers'},
      {from: 'icons', to: 'images'},
      {from: 'data', to: 'data'}
    ])
  ]
};