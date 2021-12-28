const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, "./src/index.js"),
    module: {
        rules: [{ test: /\.(js|jsx)$/, exclude: /node_modules/, use: ["babel-loader"] }],
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            favicon: "./public/favicon.ico",
            template: "./public/index.html",
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, "./dist"),
        hot: true,
    },
};
