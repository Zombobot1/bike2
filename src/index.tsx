import './sass/main.scss';
import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';

import './components/icons/icons.scss';
import './components/images/images.scss';

import InfoProvider from './components/context/info-provider';
import { _ROOT, _SANDBOX, OVERVIEW, PAGES } from './components/pages';
import { buildRoutes } from './components/utils/routing';
import { PagesInfoProvider } from './components/context/user-position-provider';
import { QueryClient, QueryClientProvider } from 'react-query';

let redirect = OVERVIEW;

if (process.env.NODE_ENV === 'development') {
  redirect = _SANDBOX;
  (async () => {
    const { worker } = await import('./api/fake-api');
    worker.start().catch(console.error);
  })();
}

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <InfoProvider>
        <PagesInfoProvider>
          <QueryClientProvider client={queryClient}>
            <Switch>
              <Redirect exact from={_ROOT} to={redirect} />
              {PAGES.map(buildRoutes)}
            </Switch>
          </QueryClientProvider>
        </PagesInfoProvider>
      </InfoProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
