import { BrowserWindow, ipcMain } from 'electron'
import url from 'url'
import path from 'path'

const RENDERER_URL =
    process.env.NODE_ENV === 'production'
        ? url.format({
              pathname: path.join(__dirname, '..', 'renderer/index.html/#setings'),
              protocol: 'file:',
              slashes: true
          })
        : 'http://localhost:1234/#settings'

function createNoBarWindow() {
    console.log(process.env.NODE_ENV)

    ipcMain.on('open-settings-dialog', () => {
        let win: any = new BrowserWindow({
            width: 800,
            height: 600
        })
        win.on('close', () => {
            win = null
        })
        win.loadURL(RENDERER_URL)
    })
}

export default function handleWindowMessage() {
    createNoBarWindow()
}
