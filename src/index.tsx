import './sass/main.scss';
import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';

import './components/icons/icons.scss';
import './components/images/images.scss';

import InfoProvider from './components/context/info-provider';
import { _ROOT, _SANDBOX, PAGES } from './components/pages';
import { buildRoutes } from './components/utils/routing';
import { PagesInfoProvider } from './components/context/user-position-provider';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <InfoProvider>
        <PagesInfoProvider>
          <Switch>
            <Redirect exact from={_ROOT} to={_SANDBOX} />
            {PAGES.map(buildRoutes)}
          </Switch>
        </PagesInfoProvider>
      </InfoProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
