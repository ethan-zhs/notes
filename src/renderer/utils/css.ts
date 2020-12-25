import theme from '../constants/theme'

/**
 * 更新css全局变量
 *
 * @param {Object} cssVars css全局变量
 */
export function cssVarUpdate(themeType: string) {
    const currentTheme = theme[themeType]

    Object.keys(currentTheme).forEach((key: any) => {
        document.documentElement.style.setProperty(key, currentTheme[key])
    })
}
