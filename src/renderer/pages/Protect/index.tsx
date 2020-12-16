import * as React from 'react'
import { Button, Alert } from 'antd'
import { ipcRenderer } from 'electron'

const styles = require('./index.less')

class Protect extends React.Component<any, any> {
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
            <div className={styles['protect']}>
                <div className={styles['protect-content-box']}>
                    <h2>程序保护</h2>
                    <CommonAlert message="点击测试程序奔溃重启" type="success" />
                    <Button onClick={this.handleCrash}>程序奔溃</Button>

                    <CommonAlert message="点击测试隐藏窗口，最小化到托盘" type="info" />
                    <Button onClick={this.handleClose}>缩小到最小托盘</Button>
                </div>
            </div>
        )
    }

    getCommonAlert = (_props: any) => {
        return <Alert className={styles['alert-box']} {..._props} />
    }

    handleCrash = () => {
        process.crash()
    }

    handleClose = () => {
        ipcRenderer.send('window-hide')
    }
}

export default Protect
