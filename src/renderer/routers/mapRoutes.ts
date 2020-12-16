import Dialog from '@renderer/pages/Dialog'
import Menus from '@renderer/pages/Menus'
import Print from '@renderer/pages/Print'
import System from '@renderer/pages/System'
import Process from '@renderer/pages/Process'
import Shell from '@renderer/pages/Shell'
import Window from '@renderer/pages/Window'
import Protect from '@renderer/pages/Protect'
import Home from '@renderer/pages/Home'

export interface IRoutesProps {
    /**
     * 路由
     */
    path: string
    /**
     * 精确匹配路由
     */
    exact: boolean
    /**
     * 组件
     */
    component: any
    /**
     * 权限匹配的唯一标识
     */
    key: string
}

/**
 * 路由配置，配置路由，可以拥有相同的key，
 * 表示这个key具有两个路由的权限 例如频道
 * 文章的编辑页面 只要拥有频道文章的权限就
 * 可以拥有编辑页面的权限，所以他们就具有
 * 相同的key
 * breadcrumb的配置必须和路由的path有关
 */

const routes: IRoutesProps[] = [
    {
        path: '/dialog',
        exact: true,
        component: Dialog,
        key: 'dialog'
    },
    {
        path: '/menu',
        exact: true,
        component: Menus,
        key: 'menu'
    },
    {
        path: '/print',
        exact: true,
        component: Print,
        key: 'print'
    },
    {
        path: '/system',
        exact: true,
        component: System,
        key: 'system'
    },
    {
        path: '/process',
        exact: true,
        component: Process,
        key: 'process'
    },
    {
        path: '/shell',
        exact: true,
        component: Shell,
        key: 'shell'
    },
    {
        path: '/window',
        exact: true,
        component: Window,
        key: 'window'
    },
    {
        path: '/protect',
        exact: true,
        component: Protect,
        key: 'protect'
    },
    {
        path: '/home',
        exact: true,
        component: Home,
        key: 'home'
    }
]

export default routes
