import './app.scss';
import React from 'react';
import { Switch } from 'react-router-dom';

import { buildRoutes, Routed } from '../utils/routing';
import NavBar from '../navigation/navbar';
import Breadcrumb from '../navigation/breadcrumb';
import Footer from '../footer';
import { useToggle } from '../utils/hooks/use-toggle';

const App = ({ routes }: Routed) => {
  const [navBarVisibility, toggleNavBarVisibility] = useToggle(false);
  return (
    <>
      <NavBar visibility={navBarVisibility} toggleVisibility={toggleNavBarVisibility} />
      <Breadcrumb toggleNavbarVisibility={toggleNavBarVisibility} />
      <main className="content-area">
        <Switch>{routes?.map(buildRoutes)}</Switch>
        <Footer className="footer" />
      </main>
    </>
  );
};

export default App;
