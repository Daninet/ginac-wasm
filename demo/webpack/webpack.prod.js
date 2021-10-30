const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    publicPath: 'auto',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.name': JSON.stringify('Codevolution'),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './public/index.html'),
      publicPath: '/ginac-wasm',
    }),
  ],
};
