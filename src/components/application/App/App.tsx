import { Navigate, Route, Routes } from 'react-router-dom'
import { styled } from '@mui/material'
import { FinishRegistration, LoginPage } from '../LoginPage/LoginPage'
import { TrainingWrapper } from '../../studying/training/training/training'
import { Trainings } from '../../studying/trainings/trainings'
import { Page404 } from '../Page404/Page404'
import { Fetch } from '../../utils/Fetch/Fetch'
import { ANY, APP, FINISH_REGISTRATION, STATS, STUDY, STUDY_ID, TEACH, TUNE } from './pages'
import { NavBar } from '../navigation/NavBar/NavBar'
import { useURouter } from '../../utils/hooks/useRouter'
import { AppBar } from '../navigation/AppBar/AppBar'
import { useState } from 'react'
import { UPage } from '../../editing/UPage/UPage'
import { useIsSignedIn, useUserInfo } from '../../../fb/auth'
import { useWorkspace } from '../Workspace/WorkspaceState'

const pages = ['study', 'teach', 'settings', 'stats']

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

  const { location } = useURouter()
  const id = location.pathname.split('/').slice(-1)[0]
  if (!pages.includes(id) && !ws.changer.has(id)) return <Page404 />

  return (
    <AppContainer>
      <AppBar workspace={ws.changer} openNavBar={() => setIsNavBarOpen(true)} />
      <NavBar user={user} workspace={ws.changer} navigation={ws.state} isNavBarOpenS={isNavBarOpenS} />
      <main>
        <Routes>
          <Route path={STUDY_ID} element={<TrainingWrapper />} />
          <Route path={STUDY} element={<Trainings />} />
          <Route path={TUNE} element={<p>Tune</p>} />
          <Route path={TEACH} element={<p>Teach</p>} />
          <Route path={STATS} element={<p>Stats</p>} />
          <Route path={ANY} element={<UPage key={id} id={id} workspace={ws.changer} />} />
        </Routes>
      </main>
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
