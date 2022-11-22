const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCss = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const babel = require("@zcloak/dev/config/babel-config-webpack.cjs");

function createWebpack(mode, alias = {}) {
  return {
    mode: mode,
    target: "web",
    entry: {
      index: path.resolve(__dirname, "src/index.tsx"),
    },

    optimization: {
      minimizer: [
        new OptimizeCss(),
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true,
            },
          },
          parallel: true,
          sourceMap: true,
        }),
      ],
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "./build"),
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "source-map-loader",
            },
            {
              loader: "babel-loader",
              options: babel,
            },
          ],
        },
        {
          test: /\.html$/,
          use: ["html-loader"],
        },
        {
          test: /\.less$/i,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 10000,
                name: "[name].[contenthash].[ext]",
                outputPath: "images",
              },
            },
          ],
        },
        {
          test: /\.(ttf|woff|woff2|eot|otf)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                name: "[name]-[contenthash].[ext]",
                outputPath: "fonts",
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".json", ".wasm"],
    },
    experiments: {
      syncWebAssembly: true,
      asyncWebAssembly: true,
    },
    plugins: [
      new NodePolyfillPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[id].[contenthash].css",
      }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(__dirname, "src/index.html"),
        chunks: ["index"],
      }),
      new CleanWebpackPlugin(),
    ],
  };
}

module.exports = createWebpack;
