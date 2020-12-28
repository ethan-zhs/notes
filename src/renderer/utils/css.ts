import theme from '../constants/theme'

/**
 * 更新自定义主题
 *
 * @param {Object} theme 自定义主题
 */
export function personalThemeUpdate({ background, color }: any) {
    const cssVars: any = {
        '--primary-bgcolor': background,
        '--primary-fontcolor': color
    }

    cssVarUpdate(cssVars)
}

/**
 * 更新全局主题
 *
 * @param {string} themeType 主题类型
 */
export function themeUpdate(config: any = {}) {
    const currentTheme = theme[config.theme]
    cssVarUpdate(currentTheme)

    if (config.theme === 'THEME_PERSONAL') {
        personalThemeUpdate({
            background: config.background,
            color: config.color
        })
    }
}

/**
 * 更新css全局变量
 *
 * @param {Object} cssVars css全局变量
 */
export function cssVarUpdate(cssVars: any) {
    Object.keys(cssVars).forEach((key: any) => {
        document.documentElement.style.setProperty(key, cssVars[key])
    })
}
