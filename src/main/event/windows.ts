import { BrowserWindow, ipcMain } from 'electron'
import url from 'url'
import path from 'path'

const html = url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, '../statics/window.html'),
    slashes: true
})

const draghtml = url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, '../statics/window_drag.html'),
    slashes: true
})

const transhtml = url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, '../statics/window_trans.html'),
    slashes: true
})

function createNoBarWindow() {
    ipcMain.on('create-nobar-window', () => {
        let win: any = new BrowserWindow({
            width: 800,
            height: 600,
            frame: false
        })
        win.on('close', () => {
            win = null
        })
        win.loadURL(html)
    })
}

function createWindowDrag() {
    ipcMain.on('create-nobar-window-drag', () => {
        let win: any = new BrowserWindow({
            width: 800,
            height: 600,
            frame: false,
            titleBarStyle: 'hidden'
        })
        win.on('close', () => {
            win = null
        })
        win.loadURL(draghtml)
    })
}

function createWindowTrans() {
    ipcMain.on('create-window-transparent', () => {
        let win: any = new BrowserWindow({
            width: 800,
            height: 600,
            transparent: true,
            frame: false,
            titleBarStyle: 'hidden'
        })
        win.on('close', () => {
            win = null
        })
        win.loadURL(transhtml)
    })
}

export default function handleWindowMessage() {
    createNoBarWindow()
    createWindowDrag()
    createWindowTrans()
}
