import { Navigate, Route, Routes } from 'react-router-dom'
import { styled } from '@mui/material'
import { FinishRegistration, LoginPage } from '../LoginPage/LoginPage'
import { TrainingWrapper } from '../../studying/training/training/training'
import { Trainings } from '../../studying/trainings/trainings'
import { Page404 } from '../Page404/Page404'
import { Fetch } from '../../utils/Fetch/Fetch'
import { ANY, APP, FINISH_REGISTRATION, STUDY, STUDY_ID } from './pages'
import { NavBar } from '../navigation/NavBar/NavBar'
import { useRouter } from '../../utils/hooks/useRouter'
import { AppBar } from '../navigation/AppBar/AppBar'
import { useState } from 'react'
import { UPage } from '../../editing/UPage/UPage'
import { useIsSignedIn, useUserInfo } from '../../../fb/auth'
import { useWorkspace } from '../Workspace/Workspace'

const pages = ['study', 'teach', 'tune']

export function App() {
  return (
    <Routes>
      <Route path={APP} element={<Navigate to={STUDY} replace />} />
      <Route path={FINISH_REGISTRATION} element={<FinishRegistration />} />
      <Route
        path={ANY}
        element={
          <Fetch>
            <App_ />
          </Fetch>
        }
      />
    </Routes>
  )
}

function App__() {
  const isNavBarOpenS = useState(false)
  const [_, setIsNavBarOpen] = isNavBarOpenS

  const user = useUserInfo()
  const ws = useWorkspace(user?.uid || '')

  const { location } = useRouter()
  const id = location.pathname.split('/').slice(-1)[0]
  if (!pages.includes(id) && !ws.changer.has(id)) return <Page404 />

  return (
    <AppContainer>
      <AppBar workspace={ws.changer} openNavBar={() => setIsNavBarOpen(true)} />
      <NavBar user={user} workspace={ws.changer} navigation={ws.state} isNavBarOpenS={isNavBarOpenS} />
      <Main>
        <Routes>
          <Route path={STUDY_ID} element={<TrainingWrapper />} />
          <Route path={STUDY} element={<Trainings />} />
          <Route path={ANY} element={<UPage key={id} id={id} workspace={ws.changer} />} />
        </Routes>
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
    ...theme.scroll('v'),
  },
}))

const Main = styled('main')(({ theme }) => ({
  [`${theme.breakpoints.up('sm')}`]: {
    marginTop: '-3.75rem',
  },
}))
