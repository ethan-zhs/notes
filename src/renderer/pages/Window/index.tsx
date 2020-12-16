import * as React from 'react'
import { Button, Alert } from 'antd'

const { remote, ipcRenderer } = require('electron')

const styles = require('./index.less')

class Window extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    render() {
        const CommonAlert = this.getCommonAlert

        return (
            <div className={styles['window']}>
                <div className={styles['window-content-box']}>
                    <h2>窗口1</h2>
                    <CommonAlert message={`点击打开一个普通的窗口`} type="success" />
                    <Button onClick={this.openNormalWindow}>打开</Button>
                    <CommonAlert message={`点击打开一个无边框窗口`} type="success" />
                    <Button onClick={this.openNoBorderWindow}>打开</Button>
                    <CommonAlert message={`点击打开一个可拖动的无边框窗口`} type="info" />
                    <Button onClick={this.openNoBorderWindowDrag}>打开</Button>
                    <CommonAlert message={`点击打开一个透明窗口`} type="info" />
                    <Button onClick={this.openTransparentWindow}>打开</Button>
                </div>
            </div>
        )
    }

    getCommonAlert = (_props: any) => {
        return <Alert className={styles['alert-box']} {..._props} />
    }

    openNormalWindow = () => {
        const mainWindow = new remote.BrowserWindow({
            width: 1000,
            height: 800
            // ...
        })
        mainWindow.loadURL('https://www.baidu.com')
    }

    openNoBorderWindow = () => {
        ipcRenderer.send('create-nobar-window')
    }

    openNoBorderWindowDrag = () => {
        ipcRenderer.send('create-nobar-window-drag')
    }

    openTransparentWindow = () => {
        ipcRenderer.send('create-window-transparent')
    }
}

export default Window
