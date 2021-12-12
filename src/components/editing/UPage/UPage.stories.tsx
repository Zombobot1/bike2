import { MemoryRouter } from 'react-router'
import { useUserInfo } from '../../../fb/auth'
import { fn, str } from '../../../utils/types'
import { useWorkspace } from '../../application/navigation/workspace'
import { UPage } from './UPage'

const T = (path: str) => () => {
  const data = useUserInfo()
  const workspace = useWorkspace(data.uid)
  return (
    <MemoryRouter initialEntries={[path]}>
      <UPage workspace={workspace} setOpenTOC={fn} setToggleFullWidth={fn} />
    </MemoryRouter>
  )
}

// export const Readonly = T('/pets')
export const Full = T('/pets')
export const Medium = T('/pets-test')
export const Small = T('/pets-test-small')

export default {
  title: 'Editing/UPage',
}
