'use strict';

var webpack = require('webpack'),
    path = require('path'),
    srcPath = path.join(__dirname, 'src'),
    OpenBrowserPlugin = require('open-browser-webpack-plugin'),
    common_config = require('./webpack.common.config');

module.exports = {
    target: 'web',
    cache: true,
    entry: {
        app: path.join(srcPath, 'app.js'),
        vendor: ['react', 'react-router', 'redux', 'react-redux']
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/',
        filename: '[name].js?v='+ common_config.hash,
        library: ['[name]'],
        pathInfo: true
    },
    module: {
        loaders: [
            { test: /\.coffee$/, loader: 'coffee-loader' },
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel?cacheDirectory'},
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192&name=images/[hash].[ext]?v='+ common_config.hash}, // inline base64 URLs for <=8k images, direct URLs for the rest
            { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff&name=fonts/[hash].[ext]" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=fonts/[hash].[ext]" },
        ]
    },
    resolve: {
        root: srcPath,
        extensions: ['', '.js', '.jsx', '.json', '.coffee', '.less', '.css', '.png', '.jpg', '.gif'],
        modulesDirectories: ['node_modules', 'src'],
    },
    plugins: [
        common_config.plugins.chunkVendorPlugin,
        common_config.plugins.HTMLInjectPlugin,
        common_config.plugins.noErrorsPlugin,
        new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
        common_config.plugins.magicGlobalsPlugin,
        new webpack.HotModuleReplacementPlugin()
    ],

    debug: true,
    devtool: 'source-map',
    devServer: {
        contentBase: './build',
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    }
};
