const webpack = require('webpack');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    publicPath: '/ginac-wasm/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.name': JSON.stringify('Codevolution'),
    }),
  ],
};
