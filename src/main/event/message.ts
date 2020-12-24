import handleWindowMessage from './windows'
import { BrowserWindow, ipcMain } from 'electron'

// 隐藏主程序窗口
function windowHide(win: any) {
    ipcMain.on('window-hide', () => {
        win.hide()
    })
}

// 关闭主程序窗口
function windowClose(win: any) {
    ipcMain.on('window-close', () => {
        win.close()
    })
}

// 关闭主程序窗口
function windowAlwaysOnTop(win: any) {
    ipcMain.on('window-always-on-top', (event, flag: boolean) => {
        win.setAlwaysOnTop(flag)
    })
}

// 关闭主程序窗口
function windowPositionLock(win: any) {
    ipcMain.on('window-position-lock', (event, movable: boolean) => {
        win.movable = movable
    })
}

// 关闭主程序窗口
function windowSizeLock(win: any) {
    ipcMain.on('window-size-lock', (event, resizable: boolean) => {
        win.resizable = resizable
    })
}

// 关闭主程序窗口
function configUpdate(win: any) {
    ipcMain.on('config-update', (event, config: any) => {
        win.webContents.send('config-update', config)
    })
}

function getSyncMsg() {
    ipcMain.on('sync-render', (event, data) => {
        console.log(data)
        event.returnValue = '主进程收到了渲染进程的【同步】消息！'
    })
}

function getAsyncMsg() {
    ipcMain.on('async-render', (event, data) => {
        console.log(data)
        event.sender.send('main-msg', '主进程收到了渲染进程的【异步】消息！')
    })
}

function sendMsgContinuous() {
    let i = 0
    let sendMsg = false
    const mainWindow = BrowserWindow.fromId(global.mainId)
    ipcMain.on('start-send', () => {
        console.log('开始定时向渲染进程发送消息！')
        sendMsg = true
    })

    ipcMain.on('end-send', () => {
        console.log('结束向渲染进程发送消息！')
        sendMsg = false
    })

    setInterval(() => {
        if (sendMsg) {
            mainWindow.webContents.send('main-msg', `Message【${i++}】`)
        }
    }, 200)
}

export default function handleMessage() {
    const mainWindow = BrowserWindow.fromId(global.mainId)
    windowHide(mainWindow)
    windowClose(mainWindow)
    windowAlwaysOnTop(mainWindow)
    windowPositionLock(mainWindow)
    windowSizeLock(mainWindow)
    configUpdate(mainWindow)
    getSyncMsg()
    getAsyncMsg()
    sendMsgContinuous()
    handleWindowMessage()
}
