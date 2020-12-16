import { globalShortcut, dialog } from 'electron'

function initGlobalShortcut() {
    globalShortcut.register('CommandOrControl+N', () => {
        dialog.showMessageBox({
            type: 'info',
            message: '嘿!',
            detail: '你触发了全局注册的快捷键 command or ctrl + N.'
        })
    })

    globalShortcut.register('CommandOrControl+L', () => {
        dialog.showMessageBox({
            type: 'info',
            message: '嘿!',
            detail: '你触发了全局注册的快捷键 command or ctrl + L.'
        })
    })
}

export default initGlobalShortcut
