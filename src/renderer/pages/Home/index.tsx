import * as React from 'react'
import classNames from 'classnames'

const styles = require('./index.less')

class Home extends React.Component<any, any> {
    constructor(props: any) {
        super(props)

        this.state = {
            taskType: 'Todo'
        }
    }

    render() {
        const MENU = ['Todo', 'Done']

        return (
            <div>
                <div className={styles['menu']}>
                    {MENU.map(item => (
                        <span
                            key={item}
                            onClick={() => this.handleChangeTaskList(item)}
                            className={classNames({
                                [styles['menu-item']]: true,
                                [styles['active']]: this.state.taskType === item
                            })}
                        >
                            {item}
                        </span>
                    ))}
                </div>

                <div>
                    <svg>
                        <use xlinkHref={require('../../statics/svg/settings.svg').default} />
                    </svg>
                </div>

                <div>
                    <span>name</span>
                    <span>已完成</span>
                </div>
            </div>
        )
    }

    handleChangeTaskList = (type: string) => {
        this.setState({ taskType: type })
    }
}

export default Home
