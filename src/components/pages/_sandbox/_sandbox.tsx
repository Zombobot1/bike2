import './_sandbox.scss';
import React from 'react';
import { useToggle } from '../../utils/hooks/use-toggle';
import 'swiper/swiper.scss';
import Breadcrumb from '../../navigation/breadcrumb';
import NavBar from '../../navigation/navbar';

export const Sandbox = () => {
  const [navBarVisibility, toggleNavBarVisibility] = useToggle(false);
  return (
    // <div
    //   style={{ width: '500px', height: '85vh', position: 'relative', padding: '50px 50px', backgroundColor: COLORS.bg }}
    // >
    //   {/*<QACard fields={[field1]} stageColor={'red'} side={'FRONT'} />*/}
    // </div>
    <>
      <NavBar visibility={navBarVisibility} toggleVisibility={toggleNavBarVisibility} />
      <Breadcrumb toggleNavbarVisibility={toggleNavBarVisibility} />
      <main className="content-area"></main>
    </>
  );
};
