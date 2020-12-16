import * as React from 'react'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

const styles = require('./index.less')

class Sidebar extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    render() {
        const { location } = this.props
        const sidebar = [
            { name: '窗口', path: '/window' },
            { name: '进程通信', path: '/process' },
            { name: '弹窗', path: '/dialog' },
            { name: '系统', path: '/system' },
            { name: '菜单', path: '/menu' },
            { name: '打印', path: '/print' },
            { name: '保护措施', path: '/protect' },
            { name: 'Shell', path: '/shell' }
        ]

        return (
            <div className={styles['sidebar']}>
                <div className={styles['sidebar-head']}>React Electron</div>
                {sidebar.map(item => (
                    <NavLink
                        className={classNames({
                            [styles['menu-item']]: true,
                            [styles['active']]: location.pathname === item.path
                        })}
                        key={item.path}
                        to={item.path}
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>
        )
    }
}

export default Sidebar
