const path = require("path");
const pkg = require("./package.json");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "react-hoax.js",
    library: "react-hoax",
    libraryTarget: "umd"
  },
  externals: Object.keys(pkg.peerDependencies || {}).concat("react-dom"),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
