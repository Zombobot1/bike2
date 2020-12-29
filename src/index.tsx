import './sass/main.scss';
import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './components/icons/icons.scss';
import './components/images/images.scss';

import App from './components/app';
import InfoProvider from './components/info-provider';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <InfoProvider>
        <App />
      </InfoProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
