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
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, FirebaseAppProvider, FirestoreProvider, useFirebaseApp } from 'reactfire'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { App } from './App/App'
import { registerServiceWorker } from '../../serviceWorkerRegistration'
import { isInProduction } from '../../fb/utils'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { connectStorageEmulator, getStorage } from 'firebase/storage'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: 'AIzaSyBilmhjT-Ri3iiwV5wSw6Hsl4B3dJZzy9U',
  authDomain: 'universe-55cec.firebaseapp.com',
  projectId: 'universe-55cec',
  storageBucket: 'universe-55cec.appspot.com',
  messagingSenderId: '809588642322',
  appId: '1:809588642322:web:1f5f4811b7ae877237becb',
}

export interface OuterShell {
  children: ReactNode
}

export function OuterShell({ children }: OuterShell) {
  const { theme } = useUTheme()

  return (
    <StrictMode>
      <OuterShell_>
        <DndProvider backend={HTML5Backend}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {isInProduction ? (
              <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
                <FB>{children}</FB>
              </FirebaseAppProvider>
            ) : (
              <>{children}</>
            )}
          </ThemeProvider>
        </DndProvider>
      </OuterShell_>
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
    <BrowserRouter>
      <OuterShell>
        <SWController />
        <App />
      </OuterShell>
    </BrowserRouter>
  )
}

function FB({ children }: OuterShell) {
  const app = useFirebaseApp()
  const auth = getAuth(app)
  const fs = getFirestore(app)

  const shouldUseEmulator = import.meta.env.VITE_USE_EMULATORS === 'true' // or other logic to determine when to use

  const firestoreSettings: { experimentalForceLongPolling?: boolean; host?: string; ssl?: boolean } = {}
  // Pass long polling setting to Firestore when running in Cypress
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).Cypress) {
    // Needed for Firestore support in Cypress (see https://github.com/cypress-io/cypress/issues/6350)
    firestoreSettings.experimentalForceLongPolling = true
  }

  // Emulate Firestore
  if (shouldUseEmulator) {
    connectFirestoreEmulator(getFirestore(), 'localhost', 8080)
    console.info(`Using Firestore emulator: http://localhost:8080`)
  }

  // Emulate Auth
  if (shouldUseEmulator) {
    connectAuthEmulator(auth, 'http://localhost:9099/', { disableWarnings: true })
    console.info(`Using Auth emulator: http://localhost:9099/`)
  }

  // Emulate Storage
  if (shouldUseEmulator) {
    connectStorageEmulator(getStorage(), 'localhost', 9199)
    console.info(`Using Storage emulator: http://localhost:9199/`)
  }

  // Emulate Cloud functions
  if (shouldUseEmulator) {
    connectFunctionsEmulator(getFunctions(), 'localhost', 5001)
    console.info(`Using Cloud functions emulator: http://localhost:5001/`)
  }

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
