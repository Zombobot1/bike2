import { MemoryRouter } from 'react-router-dom';
import { Trainings } from './trainings';

function Template() {
  return (
    <MemoryRouter initialEntries={['/app/study/']}>
      <Trainings />
    </MemoryRouter>
  );
}

export const Default = () => <Template />;
