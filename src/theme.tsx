import { createTheme } from '@material-ui/core';

export const COLORS = {
  white: '#fff',
  primary: '#1C2540',
  secondary: '#fca95c',
  tertiary: '#1b998b',
  info: '#0948b3',
  success: '#05a677',
  warning: '#f5b759',
  danger: '#fa5252',
  bg: '#F5F8FB',
  light: '#eaedf2',
};

export const SM = '(max-width: 550px)';

export const theme = createTheme({
  typography: {
    fontFamily: 'Nunito, Helvetica, sans-serif',
    fontSize: 16,

    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 10,
  },
  palette: {
    primary: {
      main: '#1C2540',
    },
    secondary: {
      main: '#fca95c',
    },
    info: {
      main: '#0948b3',
    },
    warning: {
      main: '#f5b759',
    },
    success: {
      main: '#05a677',
    },
    error: {
      main: '#fa5252',
    },
  },
});
