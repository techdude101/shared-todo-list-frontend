const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {

  return {
    mode: "development",
    entry: "./src/js/index.js",
    devServer: {
      static: "./dist",
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("development"),
          API_URL: JSON.stringify(env.API_URL),
        },
      }),
    ],
  };
};
