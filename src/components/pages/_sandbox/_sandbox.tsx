import './_sandbox.scss';
import React from 'react';
import NavBar from '../../navigation/navbar';
import Breadcrumb from '../../navigation/breadcrumb';
import Footer from '../../footer';
import { useToggle } from '../../utils/hooks/use-toggle';

type RecP = { width?: number; height?: number; color?: string };
const Rec = ({ height = 50, width = 100, color = 'red' }: RecP) => (
  <div style={{ width: `${width}px`, height: `${height}px`, backgroundColor: color }} />
);

const Sandbox = () => {
  const [navBarVisibility, toggleNavBarVisibility] = useToggle(false);

  return (
    // <div style={{ width: '100vw', height: '100vh', padding: '100px 200px', backgroundColor: COLORS.bg }}>
    //   <Rec {...training} />
    // </div>
    <>
      <NavBar visibility={navBarVisibility} toggleVisibility={toggleNavBarVisibility} />
      <Breadcrumb toggleNavbarVisibility={toggleNavBarVisibility} />
      <main className="content-area">
        <Rec />

        <Footer className="footer" />
      </main>
    </>
  );
};

export { Sandbox };
