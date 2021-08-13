import { ReactNode, StrictMode } from 'react'
import { QueryClientProvider } from 'react-query'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { theme } from '../../theme'
import { QueryClient } from 'react-query'
import { registerServiceWorker } from '../../serviceWorkerRegistration'
import { useEffect, useState, forwardRef } from 'react'
import { Fn } from '../../utils/types'
import { api } from '../../api/api'
import { useNotifications } from './useNotifications'
import { Snackbar } from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/core/Alert'
import { useIsPageVisible, useMount } from '../../utils/hooks-utils'
import { APP, PAGES, STUDY, _SANDBOX } from './navigation/pages'
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'
import { buildRoutes } from '../utils/routing'

export interface OuterShell {
  children: ReactNode
}

export function OuterShell({ children }: OuterShell) {
  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  )
}

export function Shell() {
  return (
    <OuterShell>
      <InnerShell />
    </OuterShell>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
    },
  },
})

const redirect = process.env.NODE_ENV === 'development' ? _SANDBOX : STUDY

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
