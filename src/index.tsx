import './sass/main.scss';
import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import './components/icons/icons.scss';
import './components/images/images.scss';

import InfoProvider from './components/info-provider';
import { PAGES } from './components/pages';
import { buildRoutes } from './components/utils/routing';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <InfoProvider>
        <Switch>{PAGES.map(buildRoutes)}</Switch>
      </InfoProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
