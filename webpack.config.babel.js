// Dependencies
import webpack from "webpack";
import path from "path";
import CompressionPlugin from "compression-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

import VueLoaderPlugin from "vue-loader/lib/plugin";

// Environment
const isDevelopment = process.env.NODE_ENV !== "production";

console.log("MODE DEVELOMENT:", isDevelopment);

// Paths
const PATHS = {
  index: path.join(__dirname, "src/frontend/index"),
  build: path.join(__dirname, "/dist"),
  src: path.join(__dirname, "src")
};

const getDevtool = () =>
  isDevelopment ? "cheap-module-eval-source-map" : false;

const getEntry = () => {
  const entry = [];

  if (isDevelopment) {
    entry.push(PATHS.index);
  } else {
    // production
    entry.push(PATHS.index);
  }

  return entry;
};

const getPlugins = () => {
  const plugins = [
    // Default
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.DB_ENV": JSON.stringify(process.env.DB_ENV),
      "process.env.TEMPlATE_ENV": JSON.stringify(process.env.TEMPlATE_ENV)
    }),
    new VueLoaderPlugin()
  ];

  if (isDevelopment) {
    plugins.push(
      // develoments
      new webpack.NoEmitOnErrorsPlugin()
    );
  } else {
    // production
    plugins.push(
      new CompressionPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8
      })
    );
  }

  return plugins;
};

const getOutput = () => ({
  path: PATHS.build,
  publicPath: "/",
  filename: "[name].js"
});

const getOptimization = () => {
  const optimization = {};
  optimization.runtimeChunk = "single";
  optimization.splitChunks = {
    chunks: "all",
    maxInitialRequests: Infinity,
    minSize: 0,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/][\\/]/,
        name: "vendor"
      }
    }
  };

  if (isDevelopment) {
    console.log();
  } else {
    // production
    optimization.minimizer = [
      //new TerserPlugin()
    ];
  }

  return optimization;
};

const getModule = () => {
  const module = {};

  module.rules = [
    {
      test: /\.vue$/,
      use: ["vue-loader"]
    },
    {
      test: /\.css$/,
      use: ["vue-style-loader", "css-loader"]
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: "babel-loader"
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        "style-loader",
        // Translates CSS into CommonJS
        "css-loader",
        // Compiles Sass to CSS
        "sass-loader"
      ]
    }
  ];

  return module;
};

const getResolve = () => {
  const resolve = {};
  return resolve;
};

const webpackConfig = {
  resolve: getResolve(),
  entry: getEntry(),
  devtool: getDevtool(),
  plugins: getPlugins(),
  output: getOutput(),
  optimization: getOptimization(),
  module: getModule(),
  mode: isDevelopment ? "development" : "production"
};

module.exports = webpackConfig;
