import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { Trainings } from './regular-trainings/regular-trainings';

function Template() {
  return (
    <MemoryRouter initialEntries={['/app/study/']}>
      <Trainings />
    </MemoryRouter>
  );
}

export const Default = () => <Template />;
