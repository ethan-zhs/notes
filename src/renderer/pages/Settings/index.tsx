import * as React from 'react'
import { remote, ipcRenderer } from 'electron'
import { Radio, Checkbox, Popover } from 'antd'

import { cssVarUpdate } from '../../utils/css'
import { BACKGROUND_COLORLIST, FONT_COLORLIST } from '../../constants/color'

const styles = require('./index.less')

class Settings extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            config: {}
        }
    }

    componentDidMount() {
        const config = ipcRenderer.sendSync('get-config')
        cssVarUpdate(config.theme)
        this.setState({
            config: Object.assign({}, config, {
                moveLock: !config.movable,
                sizeLock: !config.resizable
            })
        })
    }

    render() {
        const { config } = this.state

        const layerSettingsValue = ['moveLock', 'sizeLock', 'alwaysOnTop'].filter(key => config[key])

        return (
            <div>
                <header className={styles['drag-header']}></header>
                <div className={styles['header']}>
                    <div className={styles['title']}>Settings</div>

                    <div className={styles['smallest-btn']} onClick={this.handleSettingsMinimize}>
                        <svg height="100%" width="100%" viewBox="0 0 36 36">
                            <path className={styles['svg-icon']} d="M 6,16 30,16 30,19 6,19 z"></path>
                        </svg>
                    </div>

                    <div className={styles['close-btn']} onClick={this.handleSettingsClose}>
                        <svg width="100%" height="100%" viewBox="-100 0 550 370">
                            <g className={styles['svg-icon']}>
                                <polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5" />
                            </g>
                        </svg>
                    </div>
                </div>

                <div className={styles['setting-panel']}>
                    <div className={styles['setting-item']}>
                        <label>版本信息</label>
                        <div>v0.0.11 Ethan zhs</div>
                    </div>

                    <div className={styles['setting-item']}>
                        <label>图层设置</label>
                        <Checkbox.Group
                            options={[
                                { label: '位置锁定', value: 'moveLock' },
                                { label: '置于顶层', value: 'alwaysOnTop' },
                                { label: '大小锁定', value: 'sizeLock' }
                            ]}
                            value={layerSettingsValue}
                            onChange={this.handleLayerSettingChange}
                        />
                    </div>

                    <div className={styles['setting-item']}>
                        <label>界面风格</label>
                        <Radio.Group onChange={this.handleThemeChange} value={config.theme}>
                            <Radio value={'THEME_TRANSPARENT'}>透明</Radio>
                            <Radio value={'THEME_BIANQIAN'}>便签</Radio>
                            <Radio value={'THEME_PERSONAL'}>自定义</Radio>
                        </Radio.Group>
                    </div>

                    <div className={styles['setting-item']}>
                        <label>自定义主题</label>
                        <div className={styles['personal-theme-item']}>
                            <span>背景</span>
                            {this.renderColorPicker(BACKGROUND_COLORLIST)}
                        </div>
                        <div className={styles['personal-theme-item']}>
                            <span>字体</span>
                            {this.renderColorPicker(FONT_COLORLIST)}
                        </div>
                    </div>

                    <div className={styles['setting-item']}>
                        <label>程序设置</label>
                        <div className={styles['app-setting']}>
                            <a className={styles['quit-btn']} onClick={this.handleAppQuit}>
                                退出程序
                            </a>
                            <a className={styles['hide-btn']} onClick={this.handleAppHide}>
                                最小托盘
                            </a>
                            <Checkbox checked={config.openAtLogin} onChange={this.openAtLoginChange}>
                                开机启动
                            </Checkbox>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderColorPicker = (colorList: Array<string>) => {
        const { config } = this.state

        const content = (
            <div className={styles['color-panel']}>
                {colorList.map((color: string) => (
                    <div key={color} className={styles['color-item']} style={{ backgroundColor: color }}></div>
                ))}
            </div>
        )

        return (
            <Popover
                content={content}
                overlayClassName={styles['color-picker-popover']}
                trigger="click"
                placement="topLeft"
            >
                <div className={styles['color-picker']} style={{ background: config.background }}></div>
            </Popover>
        )
    }

    handleSettingsMinimize = () => {
        const w = remote.getCurrentWindow()
        w.minimize()
    }

    handleSettingsClose = () => {
        const w = remote.getCurrentWindow()
        w.close()
    }

    // 退出程序
    handleAppQuit = () => {
        ipcRenderer.send('window-close')
    }

    // 最小托盘
    handleAppHide = () => {
        ipcRenderer.send('window-hide')
        this.handleSettingsClose()
    }

    handleLayerSettingChange = (value: any) => {
        const movable = !value.includes('moveLock')
        const resizable = !value.includes('sizeLock')
        const alwaysOnTop = value.includes('alwaysOnTop')

        this.setState(
            {
                config: Object.assign({}, this.state.config, {
                    moveLock: !movable,
                    sizeLock: !resizable
                })
            },
            () => {
                this.updateConfig({
                    movable,
                    resizable,
                    alwaysOnTop
                })
            }
        )
    }

    handleThemeChange = (e: any) => {
        cssVarUpdate(e.target.value)
        this.updateConfig({ theme: e.target.value })
    }

    openAtLoginChange = () => {
        const { config } = this.state
        this.updateConfig({ openAtLogin: !config.openAtLogin })
    }

    updateConfig = (updateDatas: any) => {
        this.setState({
            config: Object.assign({}, this.state.config, updateDatas)
        })
        ipcRenderer.send('config-update', updateDatas)
    }
}

export default Settings
