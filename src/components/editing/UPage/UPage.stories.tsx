import { MemoryRouter, useLocation } from 'react-router'
import { useWorkspace } from '../../application/Workspace/WorkspaceState'
import { UPage } from './UPage'

const Inner = () => {
  const l = useLocation()
  const id = l.pathname.slice(1)
  const workspace = useWorkspace(id)
  return <UPage key={id} id={id} workspace={workspace.changer} _noOffsetFSB={true} />
}

const T = (id: 'pets-and-animals' | 'medium' | 'small') => () => {
  return (
    <MemoryRouter initialEntries={['/' + id]}>
      <Inner />
    </MemoryRouter>
  )
}

// export const Readonly = T('/pets')
export const Pets = T('pets-and-animals')
export const Medium = T('medium')
export const Small = T('small')
export const No = () => null
//move blocks from medium to small -> used in specification as an example for `setData`, `getData` and `appendToArray`
export const MoveBlocks = T('medium')

export default {
  title: 'Editing core/UPage',
}
