const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

const sharedSettings = {
  stats: {
    all: false,
    modules: true,
    errors: true,
    warnings: true,
    colors: true,
    timings: true,
  },
  devtool: "source-map",
}

const defaultConfig = {
  ...sharedSettings,
  entry: path.join(__dirname, "src/index.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "donation-encourager.js",
  },
  target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(sc|c)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  devServer: {
    hot: true,
    static: {
      directory: "./dev-page"
    },
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
}

const crossStorageConfig = {
  ...sharedSettings,
  entry: path.join(__dirname, "src/cross-storage-hub/cross-storage-hub.js"),
  output: {
    path: path.join(__dirname, "dist/cross-storage-hub"),
    filename: "cross-storage-hub.js",
    libraryTarget: "window",
    library: "CrossStorageHub",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "cross storage hub",
      inject: "head",
      template: path.join(
        __dirname,
        "src/cross-storage-hub/cross-storage-hub.html"
      ),
      filename: "cross-storage-hub.html",
      // inlineSource: '.(js|css)$'
    }),
  ],
}

if (process.env.NODE_ENV === "analyze") {
  defaultConfig.plugins.push(new BundleAnalyzerPlugin())
  // crossStorageConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = [defaultConfig, crossStorageConfig]
