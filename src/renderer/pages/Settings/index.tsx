import * as React from 'react'
import { remote, ipcRenderer } from 'electron'
import { Radio, Select, Checkbox } from 'antd'

const styles = require('./index.less')

const { Option } = Select

class Settings extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            config: {
                movable: true, // 是否可移动窗口
                resizable: false, // 是否可调节窗口大小
                alwaysTop: false, // 窗口置顶
                openAtLogin: false, // 开机自启动
                theme: '', // 主题类型
                background: '', // 自定义背景颜色
                color: '', // 自定义字体颜色
                width: 0, // 窗口宽度
                height: 0, // 窗口高度
                x: 0, // 窗口水平位置
                y: 0 // 窗口垂直位置
            }
        }
    }

    render() {
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
                        <div>
                            <Checkbox.Group
                                options={[
                                    { label: '位置锁定', value: 'move' },
                                    { label: '置于顶层', value: 'top' },
                                    { label: '大小锁定', value: 'size' }
                                ]}
                                defaultValue={['size']}
                                onChange={this.handleLayerSettingChange}
                            />
                        </div>
                    </div>
                    <div className={styles['setting-item']}>
                        <label>界面风格</label>
                        <div>
                            <Radio.Group>
                                <Radio value={1}>透明</Radio>
                                <Radio value={2}>便签</Radio>
                                <Radio value={3}>自定义</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className={styles['setting-item']}>
                        <label>自定义主题</label>
                        <div>背景颜色</div>
                        <div>字体颜色</div>
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

                            <Checkbox onChange={this.openAtLoginChange}>开机启动</Checkbox>
                        </div>
                    </div>
                </div>
            </div>
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
        ipcRenderer.send('window-always-on-top', value.includes('top'))
        ipcRenderer.send('window-size-lock', !value.includes('size'))
        ipcRenderer.send('window-position-lock', !value.includes('move'))
    }

    openAtLoginChange = (value: any) => {
        console.log(value)

        document.documentElement.style.setProperty('--primary-bgcolor', '#ff3232')
        ipcRenderer.send('config-update', { a: 1 })
    }
}

export default Settings
