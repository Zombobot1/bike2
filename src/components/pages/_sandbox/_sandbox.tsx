import './_sandbox.scss';
import React from 'react';
import { useToggle } from '../../utils/hooks/use-toggle';
import 'swiper/swiper.scss';
import Breadcrumb from '../../navigation/breadcrumb';
import NavBar from '../../navigation/navbar';
import { Rec } from './rec';
import { UInput } from '../../uform/ufields/uinput';

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
      <main className="content-area">
        <Rec isHidden={true} />
        <UInput question={'q?'} correctAnswer={'correct'} explanation={'cuz'} />
      </main>
    </>
  );
};
