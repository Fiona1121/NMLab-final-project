const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("dotenv").config({ path: "./.env" });

module.exports = {
    entry: path.resolve(__dirname, "./src/index.js"),
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"],
        fallback: {
            stream: require.resolve("stream-browserify"),
            buffer: require.resolve("buffer"),
            fs: false,
        },
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",
        publicPath: "/",
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            favicon: "./public/favicon.ico",
            template: "/public/index.html",
        }),
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
            process: "process/browser",
        }),
        new webpack.ProvidePlugin({
            React: "react",
        }),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env),
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: path.resolve(__dirname, "./public/static/") }],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(
                        __dirname,
                        "./src/data/transactions.json"
                    ),
                },
            ],
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, "./dist"),
        historyApiFallback: true,
        hot: true,
    },
};
