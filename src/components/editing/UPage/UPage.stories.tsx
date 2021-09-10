import { MemoryRouter } from 'react-router'
import { str } from '../../../utils/types'
import { UPage } from './UPage'

const T = (path: str) => () => {
  return (
    <MemoryRouter initialEntries={[path]}>
      <UPage />
    </MemoryRouter>
  )
}

export const Full = T('/pets')

export default {
  title: 'Editing/UPage',
}
