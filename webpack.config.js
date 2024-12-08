const path = require("path");
const webpack = require("webpack");

module.exports = () => {
  console.log(`API URL = ${process.env.API_URL}`);
  
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
        'process.env.API_URL': JSON.stringify(process.env.API_URL),
        'process.env.USER_ID': JSON.stringify(process.env.USER_ID)
      }),
    ],
  };
};
