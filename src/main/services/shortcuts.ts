import { globalShortcut } from 'electron'

function initGlobalShortcut() {
    globalShortcut.register('CommandOrControl+N', () => {
        console.log('你触发了全局注册的快捷键 command or ctrl + N.')
    })

    globalShortcut.register('CommandOrControl+L', () => {
        console.log('你触发了全局注册的快捷键 command or ctrl + L.')
    })
}

export default initGlobalShortcut
