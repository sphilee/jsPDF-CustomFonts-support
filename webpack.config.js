const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const {version, homepage} = require('./package.json');

module.exports = (env, options) => {
    const config = {
        entry: {
            debug: './src/index.js',
            min: './src/index.js'
        },
        output: {
            filename: 'jspdf.customfonts.[name].js',
            libraryTarget: "umd",
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|docs)/
            }]
        },
        externals: {
            jspdf: {
                commonjs: "jspdf",
                commonjs2: "jspdf",
                amd: "jspdf",
                root: "jsPDF"
            }
        },
        plugins: [new webpack.BannerPlugin("" +
                "jsPDF customfonts plugin v" + version + "\n" +
                "Copyright (c) 2018 GH Lee, " + homepage + "\n" +
                "\n" +
                "Licensed under the MIT License.\n" +
                "https://opensource.org/licenses/mit-license\n"),
            new CleanWebpackPlugin(['dist'])
        ],
        optimization: {
            minimize: true,
            minimizer: [new UglifyJsPlugin({
                include: /\.min\.js$/
            })]
        }
    }

    return config;
}