const webpack = require('webpack');
const WrapperPlugin = require('wrapper-webpack-plugin');
const pkg = require('./package.json');

const header = `
/**
 * MaxRectsBinPack ${pkg.version}
 * Copyright (c) 2017-present @06wj
 * @license MIT
 */
`;

const footer = `

`;

module.exports = function(env, argv) {
    let isDev = env;
    let mode = isDev ? 'development' : 'production'; 
    return {
        module: {
            rules: [{
                enforce: 'pre',
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'eslint-loader'
                }
            }, {
                test: /\.js$/,
                // exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }]
        },
        entry: {
            MaxRectsBinPack: ['./src/MaxRectsBinPack.js']
        },
        output: {
            path: __dirname + '/build',
            filename: '[name].js',
            library: 'MaxRectsBinPack',
            libraryTarget: 'umd',
            globalObject: 'typeof self !== \'undefined\' ? self : this'
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                options: {}
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new WrapperPlugin({
                header: header,
                footer: footer,
                test: ['MaxRectsBinPack.js']
            }),
        ],
        mode: mode
    }
}