const path = require("path"); // import node.js built-in path module
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx", // the entry point for the app
    mode: "development",
    devtool: "inline-source-map", // if and how the source-map are generated
    devServer: {
        // https://webpack.js.org/configuration/dev-server/
        contentBase: path.join(__dirname, "dist"),
        inline: true,
        compress: true,
        port: 9000,
    },
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
        alias: {
            Assets: path.resolve(__dirname, "assets"),
        },
    },
    module: {
        // load a particular file when requested by the app, using loaders
        rules: [
            {
                // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader", // extracts source maps from existing source file
            },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            {
                test: /\.(png|jpe?g|gif|jp2|webp)$/,
                use: [
                    {
                        loader: "file-loader",
                    },
                ],
                // options: {
                //     name: "[path][name].[ext]", // Fehler!!
                // },
            },
        ],
    },
    plugins: [
        // extend webpack functionality
        new HtmlWebpackPlugin({
            // simplifies creation of HTML files to serve your webpack bundles
            template: path.resolve(__dirname, "www", "index.html"),
        }),
    ],
};
