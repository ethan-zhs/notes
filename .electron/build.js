const chalk = require('chalk')
const webpack = require('webpack')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const rendererConfig = require('./webpack.renderer.config')
const mainConfig = require('./webpack.main.config')

function logTitle(str) {
    console.log(chalk.blue(`\n----------------------------------------------\n${str}\n`))
}

function buildMain() {
    logTitle('Build main process')
    return new Promise((resolve, reject) => {
        const compiler = webpack(mainConfig)
        
        compiler.run((err, stats) => {
            if (err) {
                console.log(err)
                return
            }

            console.log(stats.toString({ colors: true }))
            resolve()
        })
    })    
}

function buildRenderer() {
    logTitle('Build renderer process')
    return new Promise((resolve, reject) => {
        const compiler = webpack(rendererConfig)
        compiler.run((err, stats) => {
            if (err) {
                console.log(err)
                return
            }

            console.log(stats.toString({ colors: true }))
            resolve()
        })
    })    
}

// 运行开发环境
async function runBuild() {
    console.clear()
    await buildMain()
    await buildRenderer()
}

runBuild()