const fs = require("fs")
const path = require("path")
const webpack = require("webpack")

const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
    mode: "development",
    entry: {
        better_calculator: "./src/userscripts/better_calculator/index.ts",
        chip_damage_tracker: "./src/userscripts/chip_damage_tracker/index.ts",
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
            {
                test: /\.png/,
                type: 'asset/inline'
            }
        ],
    },
    resolve: {
        alias: {
            'src': path.resolve(__dirname, 'src'),
        },
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
                        comments: /@|UserScript/
                    },
                    mangle: {
                        reserved: ["playersInfo", "terrainInfo", "buildingsInfo"],
                    },
                },
            }),
        ],
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: ({ chunk }) => {
                return fs.readFileSync(
                    path.join(__dirname, "src", "userscripts", chunk.name, "meta.ts"),
                    { encoding: "utf8" },
                )
            },
            raw: true,
        }),
    ],
}
