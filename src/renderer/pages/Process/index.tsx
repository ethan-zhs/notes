import * as React from 'react'
import { Button, Alert } from 'antd'
import { ipcRenderer, remote } from 'electron'

const styles = require('./index.less')

const { getGlobal } = remote

class Process extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            msg: '',
            showGlobalData: false
        }
    }

    componentDidMount() {
        ipcRenderer.on('main-msg', (event, msg) => {
            this.setState({ msg })
        })
    }

    render() {
        const { msg, showGlobalData, mainId, dirname, myField } = this.state
        const CommonAlert = this.getCommonAlert

        return (
            <div className={styles['process']}>
                <div className={styles['process-content-box']}>
                    <h2>进程通信</h2>
                    <CommonAlert message="点击向主进程发送【异步】消息" type="info" />
                    <Button onClick={this.handleSendAsync}>发送</Button>

                    <CommonAlert message="点击向主进程发送【同步】消息" type="success" />
                    <Button onClick={this.handleSendSync}>发送</Button>

                    <CommonAlert message="点击告诉主进程，开始向渲染进程发送消息" type="success" />
                    <Button onClick={this.startSend}>开始发送</Button>
                    <Button onClick={this.endSend}>结束发送</Button>
                    <CommonAlert message={`主进程的回应：【${msg}】`} type="success" />
                </div>

                <div className={styles['process-content-box']}>
                    <h2>remote</h2>
                    <CommonAlert message="使用remote直接调用主进程模块" type="info" />
                    <Button onClick={this.remoteUserMainApi}>发送</Button>
                </div>

                <div className={styles['process-content-box']}>
                    <h2>global数据共享</h2>
                    <CommonAlert message="点击读取主进程存储的全局信息" type="info" />
                    {showGlobalData && (
                        <>
                            <CommonAlert message={`主窗口ID：【${mainId}】`} type="success" />
                            <CommonAlert message={`主进程入口目录：【${dirname}】`} type="success" />
                            <CommonAlert message={`自定义属性：【${myField.name}】`} type="success" />
                        </>
                    )}
                    <Button onClick={this.getGlobalData}>读取</Button>
                    <Button onClick={this.updateGlobalData}>改变共享数据</Button>
                </div>
            </div>
        )
    }

    getCommonAlert = (_props: any) => {
        return <Alert className={styles['alert-box']} {..._props} />
    }

    handleSendSync = () => {
        const msg = ipcRenderer.sendSync('sync-render', '我是来自渲染进程的同步消息')
        this.setState({ msg })
    }

    handleSendAsync = () => {
        ipcRenderer.send('async-render', '我是来自渲染进程的异步消息')
    }

    startSend = () => {
        ipcRenderer.send('start-send')
    }

    endSend = () => {
        ipcRenderer.send('end-send')
    }

    getGlobalData = () => {
        this.setState({
            showGlobalData: true,
            mainId: getGlobal('mainId'),
            dirname: getGlobal('__dirname'),
            myField: getGlobal('myField')
        })
    }

    updateGlobalData = () => {
        getGlobal('myField').name = '改变后的内容👀✨'
        this.setState({ myField: getGlobal('myField') })
    }

    remoteUserMainApi = () => {
        remote.dialog.showMessageBox({
            type: 'info',
            title: '提示信息',
            message: '这是一个对话弹框！',
            buttons: ['确定', '取消']
        })
    }
}

export default Process
