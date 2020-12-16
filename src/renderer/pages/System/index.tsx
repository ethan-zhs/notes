import * as React from 'react'
import { Button, Alert, Input } from 'antd'

const { remote, clipboard, desktopCapturer, shell } = require('electron')
const os = require('os')
const fs = require('fs')
const path = require('path')

const styles = require('./index.less')

class System extends React.Component<any, any> {
    private clipboardRef: any
    constructor(props: any) {
        super(props)
        this.state = {
            appPath: '',
            osHomeDir: '',
            copyText: '',
            pasteText: '',
            imgMsg: ''
        }

        this.clipboardRef = React.createRef()
    }

    render() {
        const { appPath, osHomeDir, copyText, pasteText, imgMsg } = this.state
        const CommonAlert = this.getCommonAlert

        return (
            <div className={styles['system']}>
                <div className={styles['system-content-box']}>
                    <h2>系统信息</h2>
                    <CommonAlert message={`当前应用程序路径：${appPath}`} type="info" />
                    <Button onClick={this.getAppPath}>获取应用路径</Button>
                    <CommonAlert message={`系统路径主目录：${osHomeDir}`} type="info" />
                    <Button onClick={this.getOsHomeDir}>获取系统路径</Button>
                    <CommonAlert message={`electron版本：${process.versions.electron}`} type="success" />
                    <CommonAlert message={`chrome版本：${process.versions.chrome}`} type="success" />
                    <CommonAlert message={`node版本：${process.versions.node}`} type="success" />
                    <CommonAlert message={`v8版本：${process.versions.v8}`} type="success" />
                </div>

                <div className={styles['system-content-box']}>
                    <h2>复制 / 粘贴</h2>
                    <Input ref={this.clipboardRef} />
                    <CommonAlert message={`点击复制上面内容：${copyText}`} type="success" />
                    <Button onClick={this.copyText}>复制</Button>
                    <CommonAlert message={`点击粘贴剪切板内容：${pasteText}`} type="success" />
                    <Button onClick={this.pasteText}>粘贴</Button>
                </div>

                <div className={styles['system-content-box']}>
                    <h2>截图</h2>
                    <CommonAlert message={`点击获取屏幕截图：${imgMsg}`} type="info" />
                    <Button onClick={this.getImg}>截图</Button>
                </div>
            </div>
        )
    }

    getCommonAlert = (_props: any) => {
        return <Alert className={styles['alert-box']} {..._props} />
    }

    getAppPath = () => {
        this.setState({
            appPath: remote.app.getAppPath()
        })
    }

    getOsHomeDir = () => {
        this.setState({
            osHomeDir: os.homedir()
        })
    }

    copyText = () => {
        const val = this.clipboardRef?.current?.state?.value
        if (val) {
            clipboard.writeText(val)
            this.setState({
                copyText: `复制成功！${val}`
            })
        }
    }

    pasteText = () => {
        this.setState({
            pasteText: clipboard.readText()
        })
    }

    getImg = () => {
        this.setState({ imgMsg: '正在截取屏幕...' })
        const thumbSize = this.determineScreenShotSize()
        const options = { types: ['window', 'screen'], thumbnailSize: thumbSize }

        desktopCapturer.getSources(options).then((sources: any) => {
            sources.forEach((source: any) => {
                if (source.name === 'Electron') {
                    const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')
                    console.log(source, screenshotPath, source.thumbnail.toPNG())
                    try {
                        fs.writeFileSync(screenshotPath, source.thumbnail.toPNG())
                        shell.openExternal(`file://${screenshotPath}`)

                        this.setState({
                            imgMsg: `截图保存到: ${screenshotPath}`
                        })
                    } catch (err) {
                        console.log(err)
                    }
                }
            })
        })
    }

    determineScreenShotSize = () => {
        const screenSize = remote.screen.getPrimaryDisplay().workAreaSize
        const maxDimension = Math.max(screenSize.width, screenSize.height)
        return {
            width: maxDimension * window.devicePixelRatio,
            height: maxDimension * window.devicePixelRatio
        }
    }
}

export default System
