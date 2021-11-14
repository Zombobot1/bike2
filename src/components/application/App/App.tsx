import { Redirect, Route, Switch } from 'react-router-dom'
import { styled } from '@mui/material'
import { FinishRegistration, LoginPage } from '../LoginPage/LoginPage'
import { TrainingWrapper } from '../../studying/training/training/training'
import { Trainings } from '../../studying/trainings/trainings'
import { Page404 } from '../Page404/Page404'
import { Fetch } from '../../utils/Fetch/Fetch'
import { ANY, APP, FINISH_REGISTRATION, STUDY, STUDY_ID } from './pages'
import { NavBar } from '../navigation/NavBar/NavBar'
import { useWorkspace } from '../navigation/workspace'
import { useRouter } from '../../utils/hooks/useRouter'
import { AppBar } from '../navigation/AppBar/AppBar'
import { useState } from 'react'
import { UPage } from '../../editing/UPage/UPage'
import { _apm } from '../theming/theme'
import { useIsSignedIn, useUserInfo } from '../../../fb/auth'

const pages = ['study', 'teach', 'tune']

export function App() {
  return (
    <Switch>
      <Route exact path={APP}>
        <Redirect to={STUDY} />
      </Route>
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

function App__() {
  const isNavBarOpenS = useState(false)
  const user = useUserInfo()
  const workspace = useWorkspace(user?.uid || '')
  const { location } = useRouter()
  const id = location.pathname.split('/').slice(-1)[0]
  if (!pages.includes(id) && !workspace.has(id)) return <Page404 />

  return (
    <AppContainer>
      <AppBar workspace={workspace} openNavBar={() => isNavBarOpenS[1](true)} />
      <NavBar user={user} workspace={workspace} isNavBarOpenS={isNavBarOpenS} />
      <Main>
        <Switch>
          <Route path={STUDY_ID}>
            <TrainingWrapper />
          </Route>
          <Route path={STUDY}>
            <Trainings />
          </Route>
          <Route path={ANY}>
            <UPage workspace={workspace} />
          </Route>
        </Switch>
      </Main>
    </AppContainer>
  )
}

function App_() {
  const { isSignedIn } = useIsSignedIn()
  if (!isSignedIn) return <LoginPage />
  return <App__ />
}

const AppContainer = styled('div', { label: 'App' })(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflowX: 'hidden',

  [`${theme.breakpoints.up('sm')}`]: {
    '::-webkit-scrollbar': {
      width: '10px',
    },

    '::-webkit-scrollbar-thumb': {
      borderRadius: '7.5px',
      backgroundColor: _apm(theme, 0.15),
    },
  },
}))

const Main = styled('main')(({ theme }) => ({
  [`${theme.breakpoints.up('sm')}`]: {
    marginTop: '-3.75rem',
  },
}))
