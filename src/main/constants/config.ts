import electron from 'electron'

export default function getDefaultConfig() {
    const display = electron.screen.getPrimaryDisplay()
    const width = display.bounds.width

    return {
        movable: true, // 是否可移动窗口
        resizable: false, // 是否可调节窗口大小
        alwaysOnTop: false, // 窗口置顶
        openAtLogin: false, // 开机自启动
        theme: 'THEME_TRANSPARENT', // 主题类型
        background: 'rgb(255, 248, 144)', // 自定义背景颜色
        color: 'rgb(119, 80, 37)', // 自定义字体颜色
        width: 300, // 窗口宽度
        height: 500, // 窗口高度
        x: width - 320, // 窗口水平位置
        y: 20 // 窗口垂直位置
    }
}
