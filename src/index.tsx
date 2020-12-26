import './sass/main.scss';
import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './components/icons/icons.scss';
import './components/images/images.scss';

import App from './components/app';
import appProperties from './content';

const { hero, features, pricing } = appProperties;

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App hero={hero} features={features} pricing={pricing} />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
