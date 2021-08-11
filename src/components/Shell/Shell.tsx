import { StrictMode } from 'react'
import { QueryClientProvider } from 'react-query'
import { _ROOT, PAGES } from './navigation/pages'
import { ThemeProvider } from '@material-ui/core'
import { theme } from '../../theme'
import { buildRoutes } from '../utils/routing'
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'
import { Snackbar } from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/core/Alert'
import { useIsPageVisible, useMount } from '../../utils/hooks-utils'
import { Global, css } from '@emotion/react'
import { useEffect, useState, forwardRef } from 'react'
import { QueryClient } from 'react-query'
import { STUDY } from './navigation/pages'
import { _SORYBOOK } from '../../sorybook/sorybook'
import { registerServiceWorker } from '../../serviceWorkerRegistration'
import { Fn } from '../../utils/types'
import { useNotifications } from './useNotifications'
import { api } from '../../api/api'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
    },
  },
})

const redirect = process.env.NODE_ENV === 'development' ? _SORYBOOK : STUDY

export function Shell() {
  useNotifications(api.subscribeForNotifications)

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <GlobalCss />
        <Router>
          <SWController />
          <QueryClientProvider client={queryClient}>
            <Switch>
              <Redirect exact from={_ROOT} to={redirect} />
              {PAGES.map(buildRoutes)}
            </Switch>
          </QueryClientProvider>
        </Router>
      </ThemeProvider>
    </StrictMode>
  )
}

function GlobalCss() {
  return (
    <Global
      styles={css`
        body,
        html {
          margin: 0;
          padding: 0;
        }

        pre {
          margin: 0;
        }

        * {
          box-sizing: border-box;
        }
      `}
    />
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
