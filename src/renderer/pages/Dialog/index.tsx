import * as React from 'react'
import { Button, Alert } from 'antd'
import { remote } from 'electron'

const styles = require('./index.less')

class Dialog extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    render() {
        const CommonAlert = this.getCommonAlert

        return (
            <div className={styles['dialog']}>
                <div className={styles['dialog-content-box']}>
                    <h2>弹窗</h2>
                    <CommonAlert message={`点击打开一个错误弹窗`} type="success" />
                    <Button onClick={this.showErrorBox}>打开</Button>
                    <CommonAlert message={`点击打开一个系统对话弹窗`} type="success" />
                    <Button onClick={this.showMessageBox}>打开</Button>
                    <CommonAlert message={`点击打开一个文件选择框`} type="success" />
                    <Button onClick={this.showOpenDialog}>打开</Button>
                    <CommonAlert message={`点击打开一个信息提示框`} type="success" />
                    <Button onClick={this.showMessage}>打开</Button>
                </div>
            </div>
        )
    }

    getCommonAlert = (_props: any) => {
        return <Alert className={styles['alert-box']} {..._props} />
    }

    showErrorBox = () => {
        remote.dialog.showErrorBox('错误', '这是一个错误弹框！')
    }

    showMessageBox = () => {
        remote.dialog.showMessageBox({
            type: 'info',
            title: '提示信息',
            message: '这是一个对话弹框！',
            buttons: ['确定', '取消']
        })
    }

    showOpenDialog = () => {
        remote.dialog.showOpenDialog({
            properties: ['openDirectory', 'openFile']
        })
    }

    showMessage = () => {
        console.log('isSupportNotification:', remote.Notification.isSupported())

        const options = {
            title: '信息框标题',
            body: '我是一条信息～～～'
        }

        const myNotification = new remote.Notification(options)
        myNotification.show()

        myNotification.on('click', () => {
            console.log('notification clicked')
        })
    }
}

export default Dialog
