import React from 'react';
import ReactDOM from 'react-dom';

import './sass/main.scss';

import './components/shared-icons/shared-icons.scss';

import App from './components/app';
import appProperties from './content';

ReactDOM.render(
  <React.StrictMode>
    <App hero={appProperties.hero} features={appProperties.features} pricing={appProperties.pricing} />
  </React.StrictMode>,
  document.getElementById('root'),
);
