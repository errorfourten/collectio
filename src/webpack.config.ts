const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const sass = require('sass')
const webpack = require('webpack')

type Generic = {[name: string]: string}

module.exports = (_env: Generic, argv: Generic) => {
  const { mode } = argv
  const additionalPlugins = mode === 'production'
    ? []
    : [new webpack.HotModuleReplacementPlugin()] // Enable hot module replacement

  const additionalEntries = mode === 'production'
    ? []
    : ['webpack-hot-middleware/client?http://localhost:8000']

  return {
    mode,
    entry: [
      path.resolve(__dirname, 'client'),
      ...additionalEntries
    ],
    output: {
      filename: '[name].[contenthash].js'
    },
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    resolve: {
      alias: {
        Utilities: path.resolve(__dirname, 'client/util/'),
        Components: path.resolve(__dirname, 'client/components/'),
        Assets: path.resolve(__dirname, 'client/assets/'),
        Types: path.resolve(__dirname, 'config/types'),
        '@root': path.resolve(__dirname)
      },
      extensions: ['.js', '.ts', '.tsx']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            'babel-loader',
            'ts-loader'
          ]
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: sass
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          use: ['file-loader']
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.BUILT_AT': JSON.stringify(new Date().toISOString()),
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html')
        // favicon: path.resolve(__dirname, 'client/assets/favicon-32x32.png')
      }),
      ...additionalPlugins
    ]
  }
}
