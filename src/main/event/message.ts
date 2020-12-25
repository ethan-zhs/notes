import handleWindowMessage from './windows'
import { BrowserWindow, ipcMain } from 'electron'
import * as Api from '../api/local'

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
function configUpdate(win: any) {
    ipcMain.on('config-update', (event, conf: any = {}) => {
        let config = Api.getConfig() || {}
        config = Object.assign(config, conf)

        win.resizable = config.resizable
        win.movable = config.movable
        win.setAlwaysOnTop(config.alwaysOnTop)

        Api.updateConfig(config)
        win.webContents.send('config-update', config)
    })
}

// 关闭主程序窗口
function notesUpdate(win: any) {
    ipcMain.on('notes-update', (event, notes: any = {}) => {
        Api.updateNotes(notes)
        win.webContents.send('notes-update', notes)
    })
}

// 关闭主程序窗口
function getNotes() {
    ipcMain.on('get-notes', (event: any) => {
        const notes = Api.getNotes()
        event.returnValue = notes
    })
}

// 关闭主程序窗口
function getConfig() {
    ipcMain.on('get-config', (event: any) => {
        const config = Api.getConfig()
        event.returnValue = config
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
    configUpdate(mainWindow)
    notesUpdate(mainWindow)
    getNotes()
    getConfig()
    getSyncMsg()
    getAsyncMsg()
    sendMsgContinuous()
    handleWindowMessage()
}
