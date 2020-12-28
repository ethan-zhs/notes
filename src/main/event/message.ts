import { BrowserWindow, ipcMain, app } from 'electron'
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

        // 设置窗口可改变大小
        win.resizable = config.resizable

        // 设置窗口可移动
        win.movable = config.movable

        // 设置窗口置顶
        win.setAlwaysOnTop(config.alwaysOnTop)

        // 设置开机自启动
        if (app.getLoginItemSettings().openAtLogin !== config.openAtLogin) {
            app.setLoginItemSettings({
                openAtLogin: config.openAtLogin
            })
        }

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

export default function handleMessage() {
    const mainWindow = BrowserWindow.fromId(global.mainId)
    windowHide(mainWindow)
    windowClose(mainWindow)
    configUpdate(mainWindow)
    notesUpdate(mainWindow)
    getNotes()
    getConfig()
}
