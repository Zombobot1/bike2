import './_sandbox.scss';
import React from 'react';
import NavBar from '../../navigation/navbar';
import Breadcrumb from '../../navigation/breadcrumb';
import Footer from '../../footer';
import { COLORS } from '../../../config';
import { Overview } from '../overview';
import { useToggle } from '../../utils/hooks/use-toggle';
import { Switch } from 'react-router-dom';
import { buildRoutes } from '../../utils/routing';

const Page = () => (
  <div className="d-flex">
    <div className="col-4 me-3 rec" />
    <div className="col-3 me-3 rec" />
    <div className="col-3 me-3 rec" />
  </div>
);

const Sandbox = () => {
  const [navBarVisibility, toggleNavBarVisibility] = useToggle(true);
  return (
    // <div style={{ width: '100vw', height: '100vh', padding: '100px 100px', backgroundColor: COLORS.tertiary }}>
    //   <Page />
    // </div>
    <>
      <NavBar visibility={navBarVisibility} toggleVisibility={toggleNavBarVisibility} />
      <Breadcrumb toggleNavbarVisibility={toggleNavBarVisibility} />
      <main className="content-area">
        <Footer className="footer" />
      </main>
    </>
  );
};

export { Sandbox };
