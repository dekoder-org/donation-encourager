import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __dirname = path.resolve();

const sharedSettings = {
  stats: {
    all: false,
    modules: true,
    maxModules: 0,
    errors: true,
    warnings: true,
    colors: true,
    timings: true
  },
  devtool: "source-map"
}

const defaultConfig = {
  ...sharedSettings,
  entry: path.join(__dirname, "src/index.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "donation-encourager.js"
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat"
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      title: "Custom template",
      inject: false,
      template: path.join(__dirname, "src/index.html")
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
};

const crossStorageConfig = {
  ...sharedSettings,
  entry: path.join(__dirname, "src/cross-storage-hub/cross-storage-hub.js"),
  output: {
    path: path.join(__dirname, "dist/cross-storage-hub"),
    filename: "cross-storage-hub.js",
    libraryTarget: "window",
    library: "CrossStorageHub"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "cross storage hub",
      inject: 'head',
      template: path.join(__dirname, "src/cross-storage-hub/cross-storage-hub.html"),
      filename: "cross-storage-hub.html",
      // inlineSource: '.(js|css)$'
    }),
    // new HtmlWebpackInlineSourcePlugin()
  ]
}

export default [defaultConfig, crossStorageConfig];
