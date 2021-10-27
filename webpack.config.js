const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const config = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "node.js",
    library: {
      name: "ginac",
      type: "umd",
      umdNamedDefine: true,
    },
  },

  target: "node",
  plugins: [
    // new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: "binding/build/release/ginac.wasm" }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    // fallback: {
    //   fs: false,
    //   path: false,
    //   crypto: false,
    // },
  },
};

const config2 = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "browser.js",
    library: {
      name: "ginac",
      type: "umd",
      umdNamedDefine: true,
    },
  },

  target: "web",
  plugins: [],
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      fs: false,
      path: false,
      crypto: false,
    },
  },
};

module.exports = [config, config2];
