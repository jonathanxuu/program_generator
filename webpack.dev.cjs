const baseConfig = require("./webpack.base.cjs");
const { merge } = require("webpack-merge");
const path = require("path");

module.exports = merge(baseConfig("development"), {
  devServer: {
    static: "./build",
  },
  // optimization: {
  //   runtimeChunk: "single",
  // },
  devtool: "source-map",
});
