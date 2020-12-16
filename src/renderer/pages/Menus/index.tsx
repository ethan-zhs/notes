import * as React from 'react'
import { Alert } from 'antd'
import template from '@src/main/menu/template'

const { remote } = require('electron')

const styles = require('./index.less')

class Menus extends React.Component<any, any> {
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

    componentDidMount() {
        this.handleContextMenu()
    }

    render() {
        const CommonAlert = this.getCommonAlert

        return (
            <div className={styles['menu']}>
                <div className={styles['menu-content-box']}>
                    <h2>菜单</h2>
                    <CommonAlert message={`右键本页查看自定义菜单`} type="info" />
                    <CommonAlert message="试试【command or Ctrl + M】进行最小化，由菜单创建的快捷键" type="success" />
                    <CommonAlert message="试试【command or Ctrl + N】全局注册的快捷方式" type="success" />
                </div>
            </div>
        )
    }

    handleContextMenu = () => {
        const m = remote.Menu.buildFromTemplate(template)
        const currPage = document.querySelector(`.${styles['menu']}`)
        currPage?.addEventListener('contextmenu', (e: any) => {
            e.preventDefault()
            m.popup({ window: remote.getCurrentWindow() })
        })
    }

    getCommonAlert = (_props: any) => {
        return <Alert className={styles['alert-box']} {..._props} />
    }
}

export default Menus
