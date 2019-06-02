var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

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
        test: /\.(ttf)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
      }
    ]
  },

  externals: {
    jquery: 'jQuery'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/html/index.html',
      favicon: 'images/favicon.ico'
    }),
    new CopyWebpackPlugin([
      { from: 'node_modules/jquery/dist', to: 'vendor/jquery' },
      { from: 'images', to: 'images' },
      { from: 'layers', to: 'layers' },
      { from: 'icons', to: 'images' },
      { from: 'data', to: 'data' }
    ])
  ]
}
