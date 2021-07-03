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
import { ThemeProvider } from '@material-ui/core';
import { theme } from './theme';

let redirect = STUDY;

if (process.env.NODE_ENV === 'development') {
  redirect = _SORYBOOK;
  (async () => {
    await startWorker();
  })();
}

const queryClient = new QueryClient();

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
