import * as React from 'react'
import { remote } from 'electron'

const styles = require('./index.less')

class Settings extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {}
    }

    render() {
        return (
            <div>
                <header className={styles['drag-header']}></header>
                <div className={styles['header']}>
                    <div className={styles['title']}>Settings</div>

                    <div className={styles['smallest-btn']} onClick={this.handleMinimize}>
                        <svg height="100%" width="100%" viewBox="0 0 36 36">
                            <path className={styles['svg-icon']} d="M 6,16 30,16 30,19 6,19 z"></path>
                        </svg>
                    </div>

                    <div className={styles['close-btn']} onClick={this.handleClose}>
                        <svg width="100%" height="100%" viewBox="-100 0 550 370">
                            <g className={styles['svg-icon']}>
                                <polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5" />
                            </g>
                        </svg>
                    </div>
                </div>

                <div>
                    <div>
                        <label>锁定</label>
                        <div></div>
                    </div>
                    <div>
                        <label>皮肤</label>
                        <div></div>
                    </div>
                    <div>
                        <label>快捷键</label>
                        <div></div>
                    </div>
                    <div>
                        <label>关于</label>
                        <div></div>
                    </div>
                    <div>
                        <a>退出程序</a>
                        <a>最小托盘</a>
                    </div>
                </div>
            </div>
        )
    }

    handleMinimize = () => {
        const w = remote.getCurrentWindow()
        w.minimize()
    }

    handleClose = () => {
        const w = remote.getCurrentWindow()
        w.close()
    }
}

export default Settings
