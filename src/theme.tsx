import { createTheme } from '@material-ui/core'

export const COLORS = {
  white: '#fff',
  primary: '#1C2540',
  secondary: '#fca95c',
  tertiary: '#1b998b',
  info: '#0948b3',
  success: '#05a677',
  warning: '#f5b759',
  error: '#fa5252',
  bg: '#F5F8FB',
  light: '#eaedf2',
}

export const SM = '(max-width: 550px)'

export const theme = createTheme({
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
})
