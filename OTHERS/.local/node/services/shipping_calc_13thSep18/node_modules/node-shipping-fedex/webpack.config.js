
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ENV = process.env.NODE_ENV || 'development';

module.exports = {
  devtool: 'source-map',
  entry: path.join(__dirname, 'lib', 'index.ts'),
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'index.js',
    sourceMapFilename: 'index.map',
    libraryTarget: 'commonjs2',
    library: 'node-shipping-fedex'
  },
  resolve: {
    extensions: [
      '.ts', '.js'
    ]
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: {
        loader: 'awesome-typescript-loader',
        options: {
          include: [
            'lib/**/*.ts'
          ],
          exclude: [
            /node_modules/
          ]
        }
      }
    }],
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      include: /\.min\.js$/
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'lib', 'wsdl'),
      to: 'wsdl'
    }], {
        ignore: [
          '.DS_Store',
          '*.scss'
        ]
      })
  ]
};