import { MemoryRouter } from 'react-router'
import { ws } from '../../../../content/application'
import { useUserInfo } from '../../../../fb/auth'
import { fn, str } from '../../../../utils/types'
import { useMount } from '../../../utils/hooks/hooks'
import { WS } from '../workspace'
import { AppBar, useShowAppBar } from './AppBar'

function T({ path }: { path: str }) {
  const { showAppBar } = useShowAppBar()
  useMount(showAppBar)
  const workspace = new WS(ws.favorite, ws.personal, useUserInfo().uid)
  return (
    <MemoryRouter initialEntries={[path]}>
      <AppBar workspace={workspace} openNavBar={fn} />
    </MemoryRouter>
  )
}

export const OnTrainingPage = () => T({ path: '/study/pets' })
export const OnUPage = () => T({ path: '/pets' })
export const OverflowWithThreeElements = () => T({ path: '/iteration-vs-generation' })
export const OverflowWithTwoElements = () => T({ path: '/software-design-patterns' })

export default {
  title: 'App/AppBar',
}