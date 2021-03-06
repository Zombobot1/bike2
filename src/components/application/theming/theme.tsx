/* eslint-disable @typescript-eslint/no-explicit-any */
import { alpha, createTheme, Theme, ThemeOptions, useMediaQuery } from '@mui/material'
import { bool, JSObject, num, str } from '../../../utils/types'
import { isCypress } from '../../utils/hooks/isCypress'
import { useLocalStorage } from '../../utils/hooks/useLocalStorage'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import { isStr } from '../../../utils/utils'

export const COLORS = {
  white: '#fff',
  black: '#000',
  primary: '#040F30',
  primaryLight2: '#051239', // + 2% lightness
  primaryLight5: '#061647', // + 5% lightness
  primaryLight10: '#081d5e',
  primaryLight15: '#0a2576',
  primaryLightM5: '#020718', // - 5% lightness
  secondary: '#FF9A40',
  tertiary: '#1b998b',
  info: '#0948b3',
  success: '#05a677',
  warning: '#ffaa01', // consider callout
  error: '#fa5252',
  bg: '#F5F8FB',
  light: '#eaedf2',
}

type APMType = 'bg' | 'bg-hover' | '100' | '200' | '300' | '400' | '800' | 'border' | 'secondary' | 'btn' | 'info'

export function _apm(theme: Theme, typeOrDarkAlpha: APMType | num = '100', lightAlpha?: num) {
  if (typeOrDarkAlpha === 'info') return alpha(theme.palette.info.main, 0.25)

  const isDark = theme.palette.mode === 'dark'
  const primary = theme.palette.primary.main
  if (!isStr(typeOrDarkAlpha)) {
    const darkAlpha = typeOrDarkAlpha as num
    return alpha(primary, isDark ? darkAlpha : lightAlpha || darkAlpha)
  }

  const type = typeOrDarkAlpha as APMType
  if (type === 'border') return alpha(primary, 0.3)
  else if (type === 'secondary') return alpha(primary, isDark ? 0.6 : 0.4)
  else if (type === 'btn') return isDark ? theme.palette.primary.main : theme.palette.text.secondary
  else if (type === '100' || type === 'bg') return alpha(primary, isDark ? 0.15 : 0.05)
  else if (type === '200' || type === 'bg-hover') return alpha(primary, isDark ? 0.2 : 0.1)
  else if (type === '300') return alpha(primary, isDark ? 0.3 : 0.15)
  else if (type === '400') return alpha(primary, isDark ? 0.4 : 0.2)
  else if (type === '800') return alpha(primary, isDark ? 0.8 : 0.5)

  return isDark ? theme.palette.secondary.main : theme.palette.common.white
}
type Speed = '.1' | '.2' | '.3'
export const _tra = (property: str, speed: Speed = '.2') => `${property} 0${speed}s  ease-in-out`

export const SM = '(max-width: 550px)'

function isMac() {
  // return navigator.platform.includes('Mac') deprecated
  return navigator.userAgent.includes('Mac')
}

type Scroll = 'v' | 'h'

const baseTheme = {
  typography: {
    fontFamily: 'Nunito, Helvetica, sans-serif',
    fontSize: 16,
  },
  shape: {
    borderRadius: 10,
  },
  palette: {
    primary: {
      main: COLORS.primary,
    },
    secondary: {
      main: COLORS.secondary,
    },
    info: {
      main: COLORS.info,
    },
    warning: {
      main: COLORS.warning,
    },
    success: {
      main: COLORS.success,
    },
    error: {
      main: COLORS.error,
    },
    text: { secondary: alpha(COLORS.primary, 0.4) },
  },

  components: {
    // add Mui to component name
    MuiAlert: {
      defaultProps: {
        iconMapping: {
          warning: <WarningAmberRoundedIcon fontSize="small" />,
          success: <CheckCircleOutlineRoundedIcon fontSize="small" />,
        },
      },
    },

    MuiBackdrop: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(5px)',
        },
      },
    },

    MuiSelect: {
      defaultProps: {
        IconComponent: ArrowDropDownRoundedIcon,
      },
    },
  },

  isDark: function () {
    const t = this as any
    return t.palette.mode === 'dark'
  },

  apm: function (typeOrDarkAlpha: APMType | num = 'bg', lightAlpha?: num) {
    return _apm(this as any, typeOrDarkAlpha, lightAlpha)
  },

  tra: (property: str, speed: Speed = '.2') => `${property} 0${speed}s  ease-in-out`,
  bd: function (color: 'p' | 's' | 'e' = 'p') {
    if (color === 's') return `1px solid ${this.palette.success.main}`
    if (color === 'e') return `1px solid ${this.palette.error.main}`
    return `1px solid ${_apm(this as any, 'border')}`
  },

  scroll: function (type: Scroll) {
    if (isMac()) return {}
    return {
      '::-webkit-scrollbar': {
        width: '10px',
        height: type === 'h' ? '10px' : undefined,
      },

      '::-webkit-scrollbar-thumb': {
        borderRadius: '7.5px',
        backgroundColor: _apm(this as any, 0.15),
      },
    }
  },
}

const themeDark: ThemeOptions = {
  ...baseTheme,
  palette: {
    primary: { main: COLORS.secondary },
    secondary: { main: COLORS.primary, light: COLORS.primaryLight5, dark: COLORS.primaryLightM5 },
    action: { active: COLORS.secondary, hover: alpha(COLORS.secondary, 0.1), selected: alpha(COLORS.secondary, 0.26) },
    text: { primary: COLORS.secondary, secondary: alpha(COLORS.secondary, 0.6) },
    background: { default: COLORS.primary, paper: COLORS.primary },
    mode: 'dark',
  },
}

const duration = {
  shortest: 0,
  shorter: 0,
  short: 0,
  standard: 0,
  complex: 0,
  enteringScreen: 0,
  leavingScreen: 0,
}

const lightTheme = createTheme(baseTheme)
const darkTheme = createTheme(themeDark)
const lightCypress = createTheme({ ...baseTheme, transitions: { duration } })
const darkCypress = createTheme({ ...themeDark, transitions: { duration } })

declare module '@mui/material/styles' {
  interface Theme {
    apm: (typeOrDarkAlpha?: APMType | num, lightAlpha?: num) => str
    tra: (property: str, speed?: Speed) => str
    bd: (color?: 'p' | 's' | 'e') => str
    scroll: (type: Scroll) => JSObject
    isDark: () => bool
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    apm?: (typeOrDarkAlpha?: APMType | num, lightAlpha?: num) => str
    tra?: (property: str, speed?: Speed) => str
    bd?: (color?: 'p' | 's' | 'e') => str
    scroll?: (type: Scroll) => JSObject
    isDark?: () => bool
  }
}

export type ThemeType = 'light' | 'dark'
type ThemeTypeO = ThemeType | ''

export function useUTheme() {
  const [overriddenThemeType, setOverriddenThemeType] = useLocalStorage<ThemeTypeO>('themeType', '')

  let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  if (isCypress.isCypress) prefersDarkMode = false

  const currentThemeType: ThemeType = overriddenThemeType || (prefersDarkMode ? 'dark' : 'light')

  let theme = currentThemeType === 'dark' ? darkTheme : lightTheme
  if (isCypress.isCypress) theme = currentThemeType === 'dark' ? darkCypress : lightCypress

  function toggleTheme() {
    setOverriddenThemeType((old) => {
      if (old === 'dark') return 'light'
      return 'dark'
    })
  }

  return { theme, toggleTheme, themeType: currentThemeType }
}
