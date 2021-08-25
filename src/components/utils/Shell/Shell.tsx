import { ReactNode, StrictMode } from 'react'
import { CssBaseline, styled, ThemeProvider } from '@material-ui/core'
import { useUTheme } from '../../../theme'
import { registerServiceWorker } from '../../../serviceWorkerRegistration'
import { useEffect, useState, forwardRef } from 'react'
import { Fn } from '../../../utils/types'
import { api } from '../../../api/api'
import { useNotifications } from './useNotifications'
import { Snackbar } from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/core/Alert'
import { useMount } from '../hooks/hooks'
import { useIsPageVisible } from '../hooks/useIsPageVisible'
import { APP, PAGES, STUDY, _TO_SANDBOX } from './navigation/pages'
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'
import { buildRoutes } from './routing'
import { AuthProvider, DatabaseProvider, FirebaseAppProvider, useFirebaseApp } from 'reactfire'
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'
import { connectAuthEmulator, getAuth } from 'firebase/auth'

export interface OuterShell {
  children: ReactNode
}

export function OuterShell({ children }: OuterShell) {
  const { theme } = useUTheme()

  return (
    <StrictMode>
      <OuterShell_>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
            <FB>{children}</FB>
          </FirebaseAppProvider>
        </ThemeProvider>
      </OuterShell_>
    </StrictMode>
  )
}

const OuterShell_ = styled('div')({
  width: '100vw',
  height: '100vh',
})

export function Shell() {
  return (
    <OuterShell>
      <InnerShell />
    </OuterShell>
  )
}

function FB({ children }: OuterShell) {
  const app = useFirebaseApp()
  const database = getDatabase(app)
  const auth = getAuth(app)

  if (process.env.NODE_ENV !== 'production') {
    connectDatabaseEmulator(database, 'localhost', 8080)
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  }

  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>{children}</DatabaseProvider>
    </AuthProvider>
  )
}

const firebaseConfig = {
  apiKey: 'AIzaSyBilmhjT-Ri3iiwV5wSw6Hsl4B3dJZzy9U',
  authDomain: 'universe-55cec.firebaseapp.com',
  projectId: 'universe-55cec',
  storageBucket: 'universe-55cec.appspot.com',
  messagingSenderId: '809588642322',
  appId: '1:809588642322:web:1f5f4811b7ae877237becb',
}

const redirect = process.env.NODE_ENV === 'development' ? _TO_SANDBOX : STUDY

function InnerShell() {
  useNotifications(api.subscribeForNotifications)
  return (
    <>
      <SWController />
      <Router>
        <Switch>
          <Redirect exact from={APP} to={redirect} />
          {PAGES.map(buildRoutes)}
        </Switch>
      </Router>
    </>
  )
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function SWController() {
  const [showUpdateInfo, setShowUpdateInfo] = useState(false)
  useSW(() => setShowUpdateInfo(true))

  return (
    <Snackbar
      open={showUpdateInfo}
      autoHideDuration={1000}
      onClose={() => setShowUpdateInfo(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="info" sx={{ width: '100%' }}>
        App was updated!
      </Alert>
    </Snackbar>
  )
}

function useSW(onUpdate: Fn) {
  const [isInitialized, setIsInitialized] = useState(false)
  const isVisible = useIsPageVisible()

  useMount(() => {
    registerServiceWorker(onUpdate, () => setIsInitialized(true))
  })

  useEffect(() => {
    if (isVisible && isInitialized) checkForUpdates() // without detecting initialization on the first SW installation the call of checkForUpdates forever prevents calls of onUpdate
  }, [isVisible, isInitialized])
}

function checkForUpdates() {
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((reg) => reg.update().catch(console.error)))
}
