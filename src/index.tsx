import React from 'react';
import ReactDOM from 'react-dom';

import './sass/main.scss';

import './components/shared-icons/shared-icons.scss';

import App from './components/app';
import appProperties from './content';

const { hero, features, pricing } = appProperties;

ReactDOM.render(
  <React.StrictMode>
    <App hero={hero} features={features} pricing={pricing} />
  </React.StrictMode>,
  document.getElementById('root'),
);
