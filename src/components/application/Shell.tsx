import { ReactNode, StrictMode } from 'react'
import { CssBaseline, styled, ThemeProvider } from '@mui/material'
import { useUTheme } from './theming/theme'
import { useEffect, useState, forwardRef } from 'react'
import { Fn } from '../../utils/types'
import { useNotifications } from './useNotifications'
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { useMount } from '../utils/hooks/hooks'
import { useIsPageVisible } from '../utils/hooks/useIsPageVisible'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider, FirebaseAppProvider, FirestoreProvider, useFirebaseApp } from 'reactfire'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { App } from './App/App'
import { firebaseConfig } from '../../_seeding'
import { registerServiceWorker } from '../../serviceWorkerRegistration'
import { _MOCK_FB } from '../../fb/utils'

export interface OuterShell {
  children: ReactNode
}

export function OuterShell({ children }: OuterShell) {
  const { theme } = useUTheme()

  const isProduction = process.env.NODE_ENV !== 'development' || !_MOCK_FB
  return (
    <StrictMode>
      <Router>
        <OuterShell_>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {isProduction ? (
              <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
                <FB>{children}</FB>
              </FirebaseAppProvider>
            ) : (
              <>{children}</>
            )}
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
  useNotifications()
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
