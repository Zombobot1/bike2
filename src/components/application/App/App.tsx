import { Redirect, Route, Switch } from 'react-router-dom'
import { alpha, Stack, styled } from '@material-ui/core'
import { FinishRegistration, LoginPage } from '../LoginPage/LoginPage'
import { useSigninCheck, useUser } from 'reactfire'
import { TrainingWrapper } from '../../studying/training/training/training'
import { Trainings } from '../../studying/trainings/trainings'
import { Page404 } from '../Page404/Page404'
import { Fetch } from '../../utils/Fetch/Fetch'
import { ANY, APP, FINISH_REGISTRATION, STUDY, STUDY_ID } from './pages'
import { NavBar } from '../navigation/NavBar/NavBar'
import { safe } from '../../../utils/utils'
import { useWorkspace } from '../navigation/workspace'
import { useRouter } from '../../utils/hooks/useRouter'
import { AppBar } from '../navigation/Crumbs/AppBar'
import { useState } from 'react'
import { UPage } from '../../editing/UPage/UPage'
import { apm, COLORS } from '../theming/theme'

const pages = ['study', 'teach', 'tune']

export function App_() {
  const { data: signInCheckResult } = useSigninCheck()
  const isNavBarOpenS = useState(false)
  if (!signInCheckResult.signedIn) return <LoginPage />

  const { data: user } = useUser()
  const workspace = useWorkspace(user?.uid || '')
  const { location } = useRouter()
  const id = location.pathname.split('/').slice(-1)[0]
  if (!pages.includes(id) && !workspace.has(id)) return <Page404 />

  return (
    <AppContainer>
      {/* <div style={{ position: 'sticky', height: '100px', width: '100%', backgroundColor: 'red' }}></div> */}
      <AppBar workspace={workspace} openNavBar={() => isNavBarOpenS[1](true)} />
      <NavBar user={safe(user)} workspace={workspace} isNavBarOpenS={isNavBarOpenS} />
      <Main>
        <Switch>
          <Route path={STUDY_ID}>
            <TrainingWrapper />
          </Route>
          <Route path={STUDY}>
            <Trainings />
          </Route>
          <Route path={ANY}>
            <UPage />
          </Route>
          <Route exact path={APP}>
            <Redirect to={STUDY} />
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

const AppContainer = styled('div', { label: 'App' })(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflowX: 'hidden',

  [`${theme.breakpoints.up('sm')}`]: {
    '::-webkit-scrollbar': {
      width: '15px',
      backgroundColor: apm(theme, 0.3, 0.1),
    },

    '::-webkit-scrollbar-thumb': {
      borderRadius: '7.5px',
      backgroundColor: apm(theme, 0.45, 0.15),
    },
  },
}))

const Main = styled('main')(({ theme }) => ({
  [`${theme.breakpoints.up('sm')}`]: {
    marginTop: '-3.75rem',
  },
}))
