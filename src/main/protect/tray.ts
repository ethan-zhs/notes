/**
 * 最小化到托盘  windows系统可用
 */

import { app, BrowserWindow, Tray, Menu } from 'electron'
import path from 'path'

let tray = null

export default function createTray() {
    const mainWindow = BrowserWindow.fromId(global.mainId)
    tray = new Tray(path.join(global.__dirname, 'public/icon.png'))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示主界面',
            click: () => {
                mainWindow.show()
                mainWindow.setSkipTaskbar(false)
            }
        },
        {
            label: '退出',
            click: () => {
                mainWindow.destroy()
                app.quit()
            }
        }
    ])
    // 设置最小托盘tips
    tray.setToolTip('react-electron')

    // 设置最小托盘右键菜单
    tray.setContextMenu(contextMenu)

    // 点击最小托盘显示主界面
    tray.on('click', () => {
        mainWindow.show()
        mainWindow.setSkipTaskbar(false)
    })
}
