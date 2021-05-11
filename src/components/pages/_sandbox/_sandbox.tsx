import './_sandbox.scss';
import React from 'react';
import NavBar from '../../navigation/navbar';
import Breadcrumb from '../../navigation/breadcrumb';
import { useToggle } from '../../utils/hooks/use-toggle';
import 'swiper/swiper.scss';
import { getIds } from '../../../utils/utils';

const id = getIds();

type RecP = { width?: number; height?: number; color?: string; isHidden?: boolean; _id: string };
const Rec = ({ height = 50, width = 100, color = 'red', isHidden = false, _id }: RecP) => (
  <div
    style={{ width: `${width}px`, height: `${height}px`, backgroundColor: color, display: isHidden ? 'none' : 'block' }}
  />
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
        <Rec _id={id()} isHidden={true} />
      </main>
    </>
  );
};

export { Sandbox };
