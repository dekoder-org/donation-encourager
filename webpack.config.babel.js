import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __dirname = path.resolve();

const sharedSettings = {
  entry: path.join(__dirname, "src/index.js"),
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

export default [defaultConfig];
