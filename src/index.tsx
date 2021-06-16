import './sass/main.scss';
import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';

import './components/icons/icons.scss';
import './components/images/images.scss';

import { _ROOT, _SANDBOX, PAGES, STUDY } from './components/pages';
import { buildRoutes } from './components/utils/routing';
import { QueryClient, QueryClientProvider } from 'react-query';
import { startWorker } from './api/fake-api';

let redirect = STUDY;

if (process.env.NODE_ENV === 'development') {
  redirect = _SANDBOX;
  (async () => {
    await startWorker();
  })();
}

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        {/*<ReactQueryDevtools />*/}
        <Switch>
          <Redirect exact from={_ROOT} to={redirect} />
          {PAGES.map(buildRoutes)}
        </Switch>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
