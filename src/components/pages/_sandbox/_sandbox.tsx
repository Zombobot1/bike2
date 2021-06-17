import './_sandbox.scss';
import React from 'react';
import { useToggle } from '../../utils/hooks/use-toggle';
import 'swiper/swiper.scss';
import Breadcrumb from '../../navigation/breadcrumb';
import NavBar from '../../navigation/navbar';
import { Story } from '@storybook/react';
import { TrainingDTO } from '../../study/training/training';
import { MemoryRouter } from 'react-router-dom';
import { Training } from '../../study/training/training/training';
import { trainings } from '../../../content';

const Template: Story<TrainingDTO> = (args) => {
  const [isFinished, toggle] = useToggle(false);
  return (
    <MemoryRouter initialEntries={['/app/study/']}>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ width: '500px', height: '830px' }}
      >
        {!isFinished && <Training dto={args} onLastCard={toggle} />}
        {isFinished && <h3 className="mb-3">That's all!</h3>}
        {isFinished && (
          <button className="btn btn-primary" onClick={toggle}>
            Again
          </button>
        )}
      </div>
    </MemoryRouter>
  );
};

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
        <Template {...trainings.interactive} />
      </main>
    </>
  );
};
