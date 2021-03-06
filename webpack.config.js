const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const meta = require('./package.json')

const DEV_FOLDER = "dist";
const PROD_FOLDER = "prod";

const config = {
  entry: { main: './src/index.js' },
  target: 'web',
  output: {
    path: path.resolve(__dirname, DEV_FOLDER),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(csv|json)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(svg|eot|woff|woff2|ttf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['!*.csv', '!*.json']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html',
      title: meta.name,
      hash: true,
      alwaysWriteToDisk: true
    })
  ]
}

module.exports = (_, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map'
    config.watch = true
    config.devServer = {
      contentBase: path.resolve(__dirname, DEV_FOLDER),
      historyApiFallback: true,
      watchContentBase: true
    }
    config.plugins.push(new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, DEV_FOLDER)
    }))
  }
  else if (argv.mode === 'production') {
    config.stats = {
      colors: false,
      hash: true,
      timings: true,
      assets: true,
      chunks: true,
      chunkModules: true,
      modules: true,
      children: true
    }
    config.output.path = path.resolve(__dirname, PROD_FOLDER)
    config.plugins.push(new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, PROD_FOLDER)
    }))
  }
  return config
}