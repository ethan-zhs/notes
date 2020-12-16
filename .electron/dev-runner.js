const Koa = require('koa')
const Router = require('koa-router')
const send = require('koa-send')
const cors = require('koa-cors')
const log = require('fancy-log')
const child_process = require('child_process')
const chalk = require('chalk')
const webpack = require('webpack')
const electron = require('electron')
const compress = require('koa-compress')
const e2k = require('express-to-koa')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const devConfig = require('./webpack.dev.config')
const mainConfig = require('./webpack.main.config')

function logTitle(str) {
    console.log(chalk.blue(`\n----------------------------------------------\n${str}\n`))
}

function createRouter() {
    const router = new Router()

    router
        .get('/dist', async ctx => (ctx.status = 404))
        .get('*', async ctx => {
            log(ctx.request.url)
            await send(ctx, 'src/renderer/index.html')
        })
    
    return router
}

function startMain() {
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

function startRenderer() {
    logTitle('Start renderer process')
    return new Promise((resolve, reject) => {
        const PORT = 1234
        const app = new Koa()
        const compiler = webpack(devConfig)
        const router = createRouter()

        app.keys = ['react-electron']

        app.use(compress({ threshold: 0 }))

        app.use(e2k(webpackDevMiddleware(compiler, {
            noInfo: true,
            publicPath: devConfig.output.publicPath,
            hot: true,
            headers: { 'Access-Control-Allow-Origin': '*' }
        })))

        app.use(e2k(webpackHotMiddleware(compiler)))

        app.use(
            cors({
                origin(ctx) {
                    if (ctx.url === '/test') {
                        return false
                    }
                    return '*'
                },
                exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
                maxAge: 5,
                credentials: true,
                allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
                allowHeaders: ['Content-Type', 'Authorization', 'Accept']
            })
        )    

        app.use(router.routes())

        app.listen(PORT)

        log(chalk.green('Renderer Server is running on: http://localhost:%s'), PORT) 

        compiler.hooks.done.tap('renderer-server', (stats) => {
            console.log(stats.toString({ colors: true }))
            resolve()
        });
    })
}

function startElectron() {
    logTitle('Start electron')
    const electronProcess = child_process.spawn(electron, ['.'])  

    electronProcess.stdout.on('data', function (data) {
        log(chalk.green('MAIN_PROCESS: '), data.toString());
    });
    
    electronProcess.stderr.on('data', function (data) {
        log(chalk.red('MAIN_PROCESS_ERROR: '), data.toString());
    });

    electronProcess.on('close', () => {
        process.exit()
    })
}

// 运行开发环境
async function runDev() {
    console.clear()
    await startMain()
    await startRenderer()
    startElectron()      
}

runDev()