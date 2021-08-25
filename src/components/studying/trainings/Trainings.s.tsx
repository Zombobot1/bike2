import { MemoryRouter } from 'react-router-dom'
import { Trainings } from './trainings'

function Template() {
  return (
    <MemoryRouter initialEntries={['/app/studying/']}>
      <Trainings />
    </MemoryRouter>
  )
}

export const Default = () => <Template />
