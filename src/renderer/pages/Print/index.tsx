import * as React from 'react'
import { Button, Alert, Select } from 'antd'
import * as printer from './printer'
import { remote } from 'electron'
import fs from 'fs'
import os from 'os'
import path from 'path'

const styles = require('./index.less')
const { shell } = remote
const { Option } = Select

class Print extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            printers: [],
            currentPrinter: {},
            webviewPdfPath: ''
        }
    }

    componentDidMount() {
        const printers = printer.getPrinters()
        const defaultPrinter = printers.find((p: any) => p.isDefault) || {}
        this.setState({
            printers,
            currentPrinter: defaultPrinter
        })
    }

    render() {
        const { printers, currentPrinter = {}, webviewPdfPath } = this.state
        const CommonAlert = this.getCommonAlert

        return (
            <div className={styles['print']}>
                <div className={styles['print-content-box']}>
                    <h2>打印</h2>
                    <div style={{ margin: '20px 0' }}>
                        <span style={{ marginRight: 15 }}>选择打印机</span>
                        <Select style={{ width: 200 }} value={currentPrinter.name}>
                            {printers.map((p: any) => (
                                <Option key={p.displayName} value={p.name}>
                                    {p.name}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <CommonAlert message={`点击将【当前窗口】打印到PDF：`} type="info" />
                    <Button onClick={this.printToPDF}>打印</Button>
                    <CommonAlert message={`点击将【webview】打印到PDF：${webviewPdfPath}`} type="info" />
                    <Button onClick={this.printWebviewToPDF}>打印</Button>
                    <CommonAlert message="点击将【当前窗口】选择指定打印机进行打印" type="success" />
                    <Button onClick={() => this.contentPrint(false)}>打印</Button>
                    <CommonAlert
                        message="点击将【当前窗口】选择指定打印机进行静默打印（不调用系统打印对话框）"
                        type="success"
                    />
                    <Button onClick={() => this.contentPrint(true)}>打印</Button>

                    <CommonAlert message="点击将【webview】选择指定打印机进行打印" type="info" />
                    <Button onClick={() => this.printWebview(false)}>打印</Button>
                    <div>
                        <webview
                            id="printWebview"
                            src="data:text/html,init"
                            nodeintegration={true}
                            style={{ height: '0cm', width: '0cm', visibility: 'hidden' }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    getCommonAlert = (_props: any) => {
        return <Alert className={styles['alert-box']} {..._props} />
    }

    printToPDF = async () => {
        const pdfPath = path.join(os.tmpdir(), 'contentPrint.pdf')
        const contents = remote.getCurrentWindow().webContents
        try {
            const data = await contents.printToPDF({})
            fs.writeFileSync(pdfPath, data)
            shell.openExternal(`file://${pdfPath}`)
            this.setState({ contentPdfPath: pdfPath })
        } catch (err) {
            console.log(err)
        }
    }

    printWebviewToPDF = async () => {
        const pdfPath = path.join(os.tmpdir(), 'webviewPrint.pdf')
        const webview: any = document.getElementById('printWebview')
        const renderHtml = '我是被临时插入webview的内容...'
        webview.executeJavaScript('document.documentElement.innerHTML =`' + renderHtml + '`;')

        try {
            const data = await webview.printToPDF({})
            fs.writeFileSync(pdfPath, data)
            shell.openExternal(`file://${pdfPath}`)
            this.setState({ webviewPdfPath: pdfPath })
        } catch (err) {
            console.log(err)
        }
    }

    printWebview = (silent: boolean) => {
        const webview: any = document.getElementById('printWebview')
        const renderHtml = '我是被临时插入webview的内容...'
        webview.executeJavaScript('document.documentElement.innerHTML =`' + renderHtml + '`;')
        webview.print({
            silent,
            printBackground: true,
            deviceName: this.state.curretnPrinter
        })
    }

    contentPrint = (silent: boolean) => {
        if (this.state.currentPrinter) {
            const contents = remote.getCurrentWindow().webContents
            contents.print({
                silent, // 是否静默登录
                printBackground: true,
                deviceName: this.state.currentPrinter
            })
        } else {
            remote.dialog.showErrorBox('错误', '请先选择一个打印机！')
        }
    }
}

export default Print
