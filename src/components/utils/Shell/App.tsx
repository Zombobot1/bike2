import { Switch } from 'react-router-dom'
import { buildRoutes, Routed } from './routing'
import { Breadcrumb } from './navigation/breadcrumb/breadcrumb'
import { Stack, styled } from '@material-ui/core'
import { LoginPage } from './LoginPage/LoginPage'
import { useSigninCheck } from 'reactfire'

export function App_({ routes }: Routed) {
  // const sx = useMQ({ padding: '20px' }, { padding: '5px 10px 0 10px' })

  return (
    <AppContainer>
      <Breadcrumb />
      <Main>
        <Switch>{routes?.map(buildRoutes)}</Switch>
      </Main>
    </AppContainer>
  )
}

export function App(props: Routed) {
  const { status, data: signInCheckResult } = useSigninCheck()

  if (status === 'loading') return <span>loading...</span>

  if (signInCheckResult.signedIn) return <App_ {...props} />
  return <LoginPage />
}

const AppContainer = styled(Stack)({
  width: '100%',
  height: '100%',
  overflowX: 'hidden',
})

const Main = styled('main')({
  flexGrow: 1,
})
