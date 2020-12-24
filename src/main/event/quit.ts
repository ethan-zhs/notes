/**
 * 程序退出监控
 */
import { app, BrowserWindow, ipcMain } from 'electron'

let hasQuit = false

export default function handleQuit() {
    let mainWindow: any = BrowserWindow.fromId(global.mainId)

    mainWindow.on('close', (event: any) => {
        event.preventDefault()
        hasQuit = true
        mainWindow = null
        app.exit(0)
    })

    app.on('window-all-closed', () => {
        if (!hasQuit) {
            if (process.platform !== 'darwin') {
                hasQuit = true
                ipcMain.removeAllListeners()
                app.quit()
            }
        }
    })
}
