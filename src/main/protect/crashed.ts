/**
 * 崩溃日志，崩溃重启
 */
import { BrowserWindow, crashReporter, dialog, app } from 'electron'

// 开启进程崩溃记录
crashReporter.start({
    productName: 'react-electron',
    compress: true,
    companyName: 'zhuhuishao',
    submitURL: 'http://xxx.com', // 上传崩溃日志的接口
    uploadToServer: false
})

function reloadWindow(mainWin: any) {
    if (mainWin.isDestroyed()) {
        app.relaunch()
        app.exit(0)
    } else {
        // 销毁其他窗口
        BrowserWindow.getAllWindows().forEach(w => {
            if (w.id !== mainWin.id) w.destroy()
        })
        const options = {
            type: 'info',
            title: '渲染器进程崩溃',
            message: '这个进程已经崩溃.',
            buttons: ['重载', '关闭']
        }
        dialog.showMessageBox(options).then(res => {
            const index = res.response
            if (index === 0) mainWin.reload()
            else mainWin.close()
        })
    }
}

export default function () {
    const mainWindow = BrowserWindow.fromId(global.mainId)
    mainWindow.webContents.on('render-process-gone', () => {
        const errorMessage = crashReporter.getLastCrashReport()
        console.log('App was crashed!\ncrash message: '.toString(), errorMessage)
        reloadWindow(mainWindow)
    })
}
