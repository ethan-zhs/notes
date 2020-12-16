const webpack = require('webpack')
const path = require('path')

const resolve = (...arg) => path.join(__dirname, '..', ...arg)

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry: ['webpack-hot-middleware/client?reload=true', resolve('src/renderer/index.tsx')],
    output: {
        path: resolve('dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    }
                ],
                exclude: /node_modules/,
                include: resolve('src')
            },
            {
                test: /\.(tsx|ts)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    },
                    'ts-loader'
                ],
                exclude: /node_modules/,
                include: resolve('src')
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
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
                    'style-loader',
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
                    'style-loader',
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
            '@main': resolve('src/main'),
            '@renderer': resolve('src/renderer'),
            '@components': resolve('src/renderer/components')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        // webpack热更新组件
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'electron-renderer' // 确保在渲染进程可以访问electron / nodejs api
}
