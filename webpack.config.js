// webpack.config.js
module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "index.js",
    library: "VueResize",
    libraryTarget: "umd"
  },
  module: {
    loaders: [
      // { test: /\.vue$/, loader: "vue-multi-loader" }
    ]
  }
};