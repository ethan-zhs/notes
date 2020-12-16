const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const resolve = (...arg) => path.join(__dirname, '..', ...arg)

module.exports = {
    mode: 'production',
    entry: resolve('src/renderer/index.tsx'),
    output: {
        path: resolve('dist/renderer'),
        filename: 'js/[name].[hash:8].js'
    },
    target: 'electron-renderer', // 确保在渲染进程可以访问electron / nodejs api
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
                include: resolve('src')
            },
            {
                test: /\.(tsx|ts)$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/,
                include: resolve('src')
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]'
                            }
                        }
                    },
                    'postcss-loader'
                ],
                include: resolve('src')
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]'
                            }
                        }
                    },
                    'postcss-loader',
                    'less-loader'
                ],
                include: resolve('src')
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                modifyVars: resolve('src/render/theme/antd/antd_modifyvars.js'),
                                javascriptEnabled: true
                            }
                        }
                    }
                ],
                include: resolve('node_modules/antd/lib')
            },
            {
                test: /\.(jpe?g|png|ico|gif|woff|woff2|eot|ttf|otf|svg|swf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 4000,
                            name: 'images/[name][hash:8].[ext]'
                        }
                    }
                ],
                include: resolve('src')
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            '@src': resolve('src'),
            '@renderer': resolve('src/renderer'),
            '@components': resolve('src/renderer/components')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                postcss: [autoprefixer]
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:8].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('src/renderer/template/index.tpl.html'), // 模板路径
            inject: true, // js插入位置
            chunksSortMode: 'none',
            chunks: ['manifest', 'vendor', 'main'],
            hash: true
        }),
        new ProgressBarPlugin({
            width: 150
        })
    ],

    node: {
        __dirname: false,
        __filename: false
    }
}
