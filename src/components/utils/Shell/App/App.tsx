import { Redirect, Route, Switch } from 'react-router-dom'
import { Stack, styled } from '@material-ui/core'
import { FinishRegistration, LoginPage } from '../LoginPage/LoginPage'
import { useSigninCheck } from 'reactfire'
import { TrainingWrapper } from '../../../studying/training/training/training'
import { Trainings } from '../../../studying/trainings/trainings'
import { Page404 } from '../Page404/Page404'
import { Fetch } from '../../Fetch/Fetch'
import { ANY, APP, FINISH_REGISTRATION, STUDY, STUDY_ID } from './pages'

export function App_() {
  const { data: signInCheckResult } = useSigninCheck()
  if (!signInCheckResult.signedIn) return <LoginPage />
  // const sx = useMQ({ padding: '20px' }, { padding: '5px 10px 0 10px' })

  return (
    <AppContainer>
      {/* <Breadcrumb /> */}
      <Main>
        <Switch>
          <Route exact path={APP}>
            <Redirect to={STUDY} />
          </Route>
          <Route path={STUDY_ID}>
            <TrainingWrapper />
          </Route>
          <Route path={STUDY}>
            <Trainings />
          </Route>
          <Route path={ANY}>
            <Page404 />
          </Route>
        </Switch>
      </Main>
    </AppContainer>
  )
}

export function App() {
  return (
    <Switch>
      <Route path={FINISH_REGISTRATION}>
        <FinishRegistration />
      </Route>
      <Route path={ANY}>
        <Fetch>
          <App_ />
        </Fetch>
      </Route>
    </Switch>
  )
}

const AppContainer = styled(Stack)({
  width: '100%',
  height: '100%',
  overflowX: 'hidden',
})

const Main = styled('main')({
  flexGrow: 1,
})
