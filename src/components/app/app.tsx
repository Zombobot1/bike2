import './app.scss';
import React from 'react';
import { Switch } from 'react-router-dom';

import { buildRoutes, Routed } from '../utils/routing';
import NavBar from '../navigation/navbar';
import Breadcrumb from '../navigation/breadcrumb';
import Footer from '../footer';

const App = ({ routes }: Routed) => {
  return (
    <>
      <NavBar />
      <main className="content-area">
        <Breadcrumb />
        <Switch>{routes?.map(buildRoutes)}</Switch>
        <Footer className="footer" />
      </main>
    </>
  );
};

export default App;
