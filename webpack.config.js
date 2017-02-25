const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const extractTextWebpackPlugin = new ExtractTextWebpackPlugin({
    filename: 'static/style/[name].[contenthash].css',
    disable: process.env.NODE_ENV === 'development'
});

module.exports = {
    entry: {
        app: './src/main.js',
        vendor: ['normalize.css']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'static/js/[name].[hash].js',
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                root: path.resolve(__dirname, 'src')
            }
        }, {
            test: /\.(css|scss)$/,
            loader: extractTextWebpackPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: process.env.NODE_ENV === 'production',
                        sourceMap: process.env.NODE_ENV === 'development'
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function() {
                            return [
                                require('autoprefixer')
                                // ({ browsers: 'last 2 versions' })
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [
                            path.resolve(__dirname, 'src/assets/styles')
                        ]
                    }
                }]
            })
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'file-loader',
            options: {
                name: 'static/fonts/[name].[hash].[ext]'
            }
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
                name: 'static/images/[name].[ext]?[hash]'
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        extractTextWebpackPlugin,
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'static/js/[name].[chunkhash].js'
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        })
    ],
    devServer: {
        noInfo: true
    },
    devtool: process.env.NODE_ENV === 'production' ? '' : 'source-map'
};

if (process.env.NODE_ENV === 'production') {
    var plugins = module.exports.plugins;

    plugins.push(new UglifyJsWebpackPlugin({
        sourceMap: true //has no effect without devtool option
    }));
    plugins.push(new CompressionWebpackPlugin({
        test: /\.js$|\.css$/,
    }));
}
