import path from 'path'
import url from 'url'
import { app, BrowserWindow, Menu } from 'electron'
import template from './menu/template'
import handleMessage from './event/message'
import handleQuit from './event/quit'
import createTray from './protect/tray'
import handleCrashed from './protect/crashed'
import initGlobalShortcut from './services/shortcuts'
import getDefaultConfig from './constants/config'
import * as Api from './api/local'

declare global {
    namespace NodeJS {
        interface Global {
            mainId: number
            myField: any
        }
    }
}

function createWindow() {
    let config = Api.getConfig()

    // config 不存在则初始化默认配置
    if (!config) {
        config = getDefaultConfig()
        Api.updateConfig(config)
    }

    // 创建浏览器窗口
    const win = new BrowserWindow({
        width: config.width,
        height: config.height,
        x: config.x,
        y: config.y,
        minHeight: 300,
        minWidth: 300,
        resizable: config.resizable,
        movable: config.movable,
        alwaysOnTop: config.alwaysOnTop,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true, // 允许使用node API
            enableRemoteModule: true, // 允许使用remote,
            webviewTag: true // 允许使用webview
        }
    })

    const RENDERER_URL =
        process.env.NODE_ENV === 'production'
            ? url.format({
                  pathname: path.join(__dirname, '..', 'renderer/index.html'),
                  protocol: 'file:',
                  slashes: true
              })
            : 'http://localhost:1234'

    // 为你的应用加载index.html
    win.loadURL(RENDERER_URL)

    // 打开开发者工具
    win.webContents.openDevTools()

    // 奔溃 reload window 失败，重新加载 Web URL
    win.webContents.on('did-fail-load', () => {
        console.log('did-fail-load')
        win.loadURL(RENDERER_URL)
    })

    global.mainId = win.id
    global.__dirname = path.join(__dirname, '../../')
    global.myField = { name: '自定义内容 😁🎉' }
}

// 设置App User ModalId, id与package.json的appId一致
// 只有在windows安装应用程序时, App User ModalId 才会注入到系统中，这时windows才能使用Notification功能
app.setAppUserModelId('com.electrondemo.app')

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
    createWindow()

    // 定义menu
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    // 定义全局快捷键
    initGlobalShortcut()

    // 缩小为最小托盘
    createTray()

    handleMessage()
    handleCrashed()
    handleQuit()
})

// 您可以把应用程序其他的流程写在在此文件中
// 代码 也可以拆分成几个文件，然后用 require 导入。
