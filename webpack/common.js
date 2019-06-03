const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    'app': './src/main.js'
  },

  resolve: {
    extensions: ['.js', '.json']
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
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]'
          }
        }
      },
      {
        test: /\.(ttf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }
      },
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader?sourceMap' ]
      },
      {
        test: /pages.*?\.html$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'pages/[name].[contenthash].html'
          }
        }
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[contenthash].json'
          }
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/html/index.html',
      favicon: 'images/favicon.ico'
    }),
    new CopyWebpackPlugin([
      { from: 'images', to: 'images' },
      { from: 'icons', to: 'images' },
      { from: 'data', to: 'data' }
    ]),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ]
}
