const webpack = require('webpack')
const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const resolve = (...arg) => path.join(__dirname, '..', ...arg)

const isProd = process.env.NODE_ENV === 'production'
const nodeEnv = isProd ? 'production' : 'development'

module.exports = {
    mode: nodeEnv,
    entry: resolve('src/main/index.ts'),
    output: {
        path: resolve('dist/main'),
        filename: '[name].js'
    },
    target: 'electron-main',
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
            '@main': resolve('src/main')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(nodeEnv)
        }),
        new ProgressBarPlugin({
            width: 150
        })
    ],
    node: {
        __dirname: !isProd,     // 确保__dirname能正确取值
        __filename: !isProd     // 确保__filename能正确取值
    },
}
