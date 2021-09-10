import { alpha, createTheme, Theme, useMediaQuery } from '@material-ui/core'
import { atom, useAtom } from 'jotai'
import _ from 'lodash'
import { num } from '../../../utils/types'

export const COLORS = {
  white: '#fff',
  black: '#000',
  primary: '#040F30',
  primaryLight2: '#051239', // + 2% lightness
  primaryLight5: '#061647', // + 5% lightness
  primaryLight10: '#081d5e',
  primaryLight15: '#0a2576',
  primaryLightM5: '#020718', // - 5% lightness
  secondary: '#FF7A00',
  tertiary: '#1b998b',
  info: '#0948b3',
  success: '#05a677',
  warning: '#f5b759',
  error: '#fa5252',
  bg: '#F5F8FB',
  light: '#eaedf2',
}

type APMType = 'BG' | '100' | '200' | '400' | 'BORDER' | 'SECONDARY'
const darkSecondaryAlpha = 0.6
export function apm(theme: Theme, typeOrDarkAlpha: APMType | num = 'BG', lightAlpha?: num) {
  const isDark = theme.palette.mode === 'dark'
  const primary = theme.palette.primary.main
  if (!_.isString(typeOrDarkAlpha)) {
    const darkAlpha = typeOrDarkAlpha as num
    return alpha(primary, isDark ? darkAlpha : lightAlpha || darkAlpha)
  }
  const type = typeOrDarkAlpha as APMType
  if (type === 'BORDER') return alpha(primary, 0.3)
  if (type === 'SECONDARY') return alpha(primary, isDark ? darkSecondaryAlpha : 0.4)
  if (type === '100') return alpha(primary, isDark ? 0.15 : 0.05)
  if (type === '200') return alpha(primary, isDark ? 0.2 : 0.1)
  if (type === '400') return alpha(primary, isDark ? 0.4 : 0.2)

  return isDark ? theme.palette.secondary.main : theme.palette.common.white
}

export const SM = '(max-width: 550px)'

const theme = {
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
  },
}

const lightTheme = createTheme(theme)

const darkTheme = createTheme({
  ...theme,
  palette: {
    primary: { main: COLORS.secondary },
    secondary: { main: COLORS.primary, light: COLORS.primaryLight5, dark: COLORS.primaryLightM5 },
    action: { active: COLORS.secondary, hover: alpha(COLORS.secondary, 0.1), selected: alpha(COLORS.secondary, 0.26) },
    text: { primary: COLORS.secondary, secondary: alpha(COLORS.secondary, darkSecondaryAlpha) },
    background: { default: COLORS.primary, paper: COLORS.primary },
    mode: 'dark',
  },
})

export type ThemeType = 'LIGHT' | 'DARK'
type ThemeTypeO = ThemeType | null

const THEME_KEY = 'themeType'
const getThemeType = () => localStorage.getItem(THEME_KEY) as ThemeTypeO
const setThemeType = (type: ThemeType) => localStorage.setItem(THEME_KEY, type)
const themeA = atom<ThemeTypeO>(getThemeType())

export function useUTheme() {
  const [overriddenThemeType, setOverriddenThemeType] = useAtom(themeA)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  let currentThemeType: ThemeType = prefersDarkMode ? 'DARK' : 'LIGHT'
  if (overriddenThemeType) currentThemeType = overriddenThemeType

  const theme = currentThemeType === 'DARK' ? darkTheme : lightTheme

  function setTheme(type: ThemeType) {
    setThemeType(type)
    setOverriddenThemeType(type)
  }

  function toggleTheme() {
    const oldType = getThemeType()
    let newType: ThemeType = 'DARK'
    if (oldType && oldType === 'DARK') newType = 'LIGHT'
    setTheme(newType)
  }
  return { theme, toggleTheme, themeType: currentThemeType }
}
