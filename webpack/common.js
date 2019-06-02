const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
        use: 'file-loader?name=images/[name].[ext]'
      },
      {
        test: /\.(ttf)$/,
        use: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader?sourceMap' ]
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
      { from: 'layers', to: 'layers' },
      { from: 'icons', to: 'images' },
      { from: 'data', to: 'data' }
    ]),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ]
}
