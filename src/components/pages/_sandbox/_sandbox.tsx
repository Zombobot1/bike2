import './_sandbox.scss';
import React from 'react';
// import NavBar from '../../navigation/navbar';
// import Breadcrumb from '../../navigation/breadcrumb';
// import Footer from '../../footer';
import { COLORS } from '../../../config';

const Sandbox = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', padding: '100px 100px', backgroundColor: COLORS.bg }}>
      <div>S</div>
    </div>
    // <>
    //   <NavBar />
    //   <main className="content-area">
    //     <Breadcrumb />
    //     <Study />
    //     <Footer className="footer" />
    //   </main>
    // </>
  );
};

export { Sandbox };
