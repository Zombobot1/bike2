import { WorkspaceStructure } from '../../application/Workspace/types'
import { useTestWorkspace } from '../../application/Workspace/WorkspaceState'
import { setUserId } from '../../editing/UPage/userId'
import { IdeasViewer } from './IdeasViewer'

const T = (structure: WorkspaceStructure) => {
  setUserId('cat-lover1')
  useTestWorkspace(structure)
  return (
    <div style={{ width: '100%', maxWidth: 900, paddingLeft: '1rem', paddingRight: '1rem' }}>
      <IdeasViewer />
    </div>
  )
}

const ws1: WorkspaceStructure = {
  pages: [
    {
      id: 'english',
      name: 'English',
      color: '',
      children: [{ id: 'rules', name: 'Rules', color: '' }],
    },
    { id: 'cats', name: 'Cats', color: '' },
  ],
  trash: [],
}

export const Default = () => T(ws1)

export default {
  title: 'Ideas/IdeasViewer',
}
