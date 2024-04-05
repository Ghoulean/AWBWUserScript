const fs = require("fs")
const path = require("path")
const webpack = require("webpack")

const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
    mode: "development",
    entry: {
        chip_damage_tracker: "./src/chip_damage_tracker/index.ts",
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                use: {
                    loader: "babel-loader",
                },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: {
                    banner: false,
                },
                terserOptions: {
                    format: {
                        comments: /@|UserScript/,
                    },
                },
            }),
        ],
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: ({ chunk }) => {
                return fs.readFileSync(
                    path.join(__dirname, "src", chunk.name, "meta.ts"),
                    { encoding: "utf8" },
                )
            },
            raw: true,
        }),
    ],
}
