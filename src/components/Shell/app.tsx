import { Switch } from 'react-router-dom'

import { buildRoutes, Routed } from '../utils/routing'
import { Breadcrumb } from './navigation/breadcrumb/breadcrumb'
import { useMQ } from '../../utils/hooks-utils'
import { Stack, styled } from '@material-ui/core'

const AppContainer = styled(Stack)({
  width: '100vw',
  height: '100vh',
  overflowX: 'hidden',
})

const Main = styled('main')({
  flexGrow: 1,
})

export const App = ({ routes }: Routed) => {
  const sx = useMQ({ padding: '20px' }, { padding: '5px 10px 0 10px' })

  return (
    <AppContainer>
      <Breadcrumb />
      <Main sx={sx}>
        <Switch>{routes?.map(buildRoutes)}</Switch>
      </Main>
    </AppContainer>
  )
}
