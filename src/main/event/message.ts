import handleWindowMessage from './windows'
import { BrowserWindow, ipcMain } from 'electron'

// 隐藏主程序窗口
function windowHide() {
    ipcMain.on('window-hide', () => {
        const mainWindow = BrowserWindow.fromId(global.mainId)
        mainWindow.hide()
    })
}

// 关闭主程序窗口
function windowClose() {
    ipcMain.on('window-close', () => {
        const mainWindow = BrowserWindow.fromId(global.mainId)
        mainWindow.close()
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
    windowHide()
    windowClose()
    getSyncMsg()
    getAsyncMsg()
    sendMsgContinuous()
    handleWindowMessage()
}
