import { ReactNode, StrictMode } from 'react'
import { CssBaseline, styled, ThemeProvider } from '@material-ui/core'
import { useUTheme } from './theming/theme'
import { registerServiceWorker } from '../../../serviceWorkerRegistration'
import { useEffect, useState, forwardRef } from 'react'
import { Fn } from '../../../utils/types'
import { api } from '../../../api/api'
import { useNotifications } from './useNotifications'
import { Snackbar } from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/core/Alert'
import { useMount } from '../hooks/hooks'
import { useIsPageVisible } from '../hooks/useIsPageVisible'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider, FirebaseAppProvider, FirestoreProvider, useFirebaseApp } from 'reactfire'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { App } from './App/App'

export interface OuterShell {
  children: ReactNode
}

export function OuterShell({ children }: OuterShell) {
  const { theme } = useUTheme()

  return (
    <StrictMode>
      <Router>
        <OuterShell_>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
              <FB>{children}</FB>
            </FirebaseAppProvider>
          </ThemeProvider>
        </OuterShell_>
      </Router>
    </StrictMode>
  )
}

const OuterShell_ = styled('div')({
  width: '100vw', // only here vw & vh are used
  height: '100vh',
})

export function Shell() {
  useNotifications(api.subscribeForNotifications)
  return (
    <OuterShell>
      <SWController />
      <App />
    </OuterShell>
  )
}

function FB({ children }: OuterShell) {
  const app = useFirebaseApp()
  const auth = getAuth(app)
  const fs = getFirestore(app)

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={fs}>{children}</FirestoreProvider>
    </AuthProvider>
  )
}

export const firebaseConfig = {
  apiKey: 'AIzaSyBilmhjT-Ri3iiwV5wSw6Hsl4B3dJZzy9U',
  authDomain: 'universe-55cec.firebaseapp.com',
  projectId: 'universe-55cec',
  storageBucket: 'universe-55cec.appspot.com',
  messagingSenderId: '809588642322',
  appId: '1:809588642322:web:1f5f4811b7ae877237becb',
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
