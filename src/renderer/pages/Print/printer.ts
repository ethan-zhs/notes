import { remote } from 'electron'

/**
 * 获取系统打印机列表
 */
export function getPrinters() {
    let printers: any = []
    try {
        const contents = remote.getCurrentWindow().webContents
        printers = contents.getPrinters()
    } catch (e) {
        console.error('getPrintersError', e)
    }
    return printers
}

/**
 * 获取系统默认打印机
 */
export function getDefaultPrinter() {
    return getPrinters().find((element: any) => element.isDefault)
}

/**
 * 检测是否安装了某个打印驱动
 */
export function checkDriver(driverMame: string) {
    return getPrinters().find((element: any) => (element.options['printer-make-and-model'] || '').includes(driverMame))
}

/**
 * 根据打印机名称获取打印机对象
 */
export function getPrinterByName(name: string) {
    return getPrinters().find((element: any) => element.name === name)
}
