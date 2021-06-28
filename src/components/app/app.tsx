import './app.scss';
import React from 'react';
import { Switch } from 'react-router-dom';

import { buildRoutes, Routed } from '../utils/routing';
import Breadcrumb from '../navigation/breadcrumb';

const App = ({ routes }: Routed) => {
  return (
    <>
      <Breadcrumb />
      <main className="content-area">
        <Switch>{routes?.map(buildRoutes)}</Switch>
      </main>
    </>
  );
};

export default App;
