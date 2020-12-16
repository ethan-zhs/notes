import React from 'react'
import Loadable from 'react-loadable'
import { LoadingOutlined } from '@ant-design/icons'

const styles = require('./index.less')

const AsyncComponent = (component: any) => {
    return Loadable({
        loader: component,
        loading: () => (
            <div className={styles['loading']}>
                <LoadingOutlined style={{ fontSize: 50 }} />
            </div>
        )
    })
}
export default AsyncComponent
