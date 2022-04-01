import { MemoryRouter } from 'react-router'
import { useUserInfo } from '../../../../fb/auth'
import { f, str } from '../../../../utils/types'
import { useMount } from '../../../utils/hooks/hooks'
import { useWorkspace } from '../../Workspace/Workspace'
import { AppBar, useShowAppBar } from './AppBar'

function T({ path }: { path: str }) {
  const { showAppBar } = useShowAppBar()
  useMount(showAppBar)
  const data = useUserInfo()
  const workspace = useWorkspace(data.uid)

  return (
    <MemoryRouter initialEntries={[path]}>
      <AppBar workspace={workspace.changer} openNavBar={f} />
    </MemoryRouter>
  )
}

// export const OnTrainingPage = () => T({ path: '/study/pets' })
export const OnUPage = () => T({ path: '/pets-and-animals' })
export const OverflowWithThreeElements = () => T({ path: '/iteration-vs-generation' })
export const OverflowWithTwoElements = () => T({ path: '/software-design-patterns' })

export default {
  title: 'App/AppBar',
}
