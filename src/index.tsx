import './sass/main.scss';
import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';

import './components/icons/icons.scss';

import { buildRoutes } from './components/utils/routing';
import { QueryClient, QueryClientProvider } from 'react-query';
import { startWorker } from './api/fake-api';
import { _ROOT, PAGES, STUDY } from './components/navigation/utils';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { _SORYBOOK } from './sorybook/sorybook';
import { createTheme, ThemeProvider } from '@material-ui/core';

let redirect = STUDY;

if (process.env.NODE_ENV === 'development') {
  redirect = _SORYBOOK;
  (async () => {
    await startWorker();
  })();
}

const queryClient = new QueryClient();
const theme = createTheme({
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

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <QueryClientProvider client={queryClient}>
          {/*<ReactQueryDevtools />*/}
          <Switch>
            <Redirect exact from={_ROOT} to={redirect} />
            {PAGES.map(buildRoutes)}
          </Switch>
        </QueryClientProvider>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorkerRegistration.register();
