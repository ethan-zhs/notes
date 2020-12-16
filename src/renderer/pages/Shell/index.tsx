import * as React from 'react'
import { Button, Alert } from 'antd'
import path from 'path'
import { shell, remote } from 'electron'

const styles = require('./index.less')

class Shell extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            printers: [],
            currentPrinter: {},
            webviewPdfPath: ''
        }
    }

    render() {
        const CommonAlert = this.getCommonAlert

        return (
            <div className={styles['shell']}>
                <div className={styles['shell-content-box']}>
                    <h2>shell</h2>
                    <CommonAlert message="点击触发默认浏览器打开Url" type="success" />
                    <Button onClick={this.handleOpenExternal}>打开</Button>

                    <CommonAlert message="点击打开目标路径所在文件夹" type="info" />
                    <Button onClick={this.showItemInFolder}>打开</Button>

                    <CommonAlert message="点击用桌面默认的方式打开指定路径文件" type="info" />
                    <Button onClick={this.openPath}>打开</Button>

                    <CommonAlert message="点击播放系统提示音beep" type="info" />
                    <Button onClick={this.beep}>播发</Button>

                    <CommonAlert message="点击将指定路径文件拖到垃圾箱" type="info" />
                    <Button onClick={this.moveItemToTrash}>删除</Button>
                </div>
            </div>
        )
    }

    getCommonAlert = (_props: any) => {
        return <Alert className={styles['alert-box']} {..._props} />
    }

    handleOpenExternal = () => {
        shell.openExternal('https://github.com')
    }

    showItemInFolder = () => {
        const basePath = process.env.HOME || ''
        shell.showItemInFolder(path.join(basePath))
    }

    openPath = () => {
        const basePath = process.env.HOME || ''
        shell.openPath(path.join(basePath, './.npmrc'))
    }

    beep = () => {
        shell.beep()
    }

    moveItemToTrash = () => {
        const basePath = process.env.HOME || ''
        const isSuccess = shell.moveItemToTrash(path.join(basePath, './.touchclirc'))
        if (isSuccess) {
            remote.dialog.showMessageBox({
                type: 'info',
                title: '提示信息',
                message: '删除成功',
                buttons: ['确定']
            })
        } else {
            remote.dialog.showErrorBox('错误', '删除失败')
        }
    }
}

export default Shell
