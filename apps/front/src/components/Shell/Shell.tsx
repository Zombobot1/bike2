import { StrictMode } from 'react'
import { QueryClientProvider } from 'react-query'
import { _ROOT, PAGES } from './navigation/pages'
import { ThemeProvider } from '@material-ui/core'
import { theme } from '../../theme'
import { buildRoutes } from '../utils/routing'
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'
import { Snackbar, Stack, Link } from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/core/Alert'
import { COLORS } from '../../theme'
import { useIsPageVisible } from '../../utils/hooks-utils'
import { Global, css } from '@emotion/react'
import { useEffect, useState, forwardRef } from 'react'
import { QueryClient } from 'react-query'
import * as serviceWorkerRegistration from '../../serviceWorkerRegistration'
import { STUDY } from './navigation/pages'
import { _SORYBOOK } from '../../sorybook/sorybook'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
    },
  },
})

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function SWController() {
  const [showReload, setShowReload] = useState(false)
  const [isWorkerInitialized, setIsWorkerInitialized] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true)
    setWaitingWorker(registration.waiting)
  }

  const checkForUpdates = () =>
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((reg) => reg.update().catch(console.error)))

  useEffect(() => {
    serviceWorkerRegistration.register({
      onUpdate: onSWUpdate,
      onInit: () => setIsWorkerInitialized(true),
    })
  }, [])

  const isVisible = useIsPageVisible()

  useEffect(() => {
    if (isVisible && isWorkerInitialized) checkForUpdates()
  }, [isVisible, isWorkerInitialized])

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
    setShowReload(false)
    window.location.reload()
  }

  return (
    // anomaly: be sure that your app uses resources: <img src={import logo from './logo.svg'} style={{ display: 'none' }} />
    // otherwise this dialog will not appear at all
    <Snackbar open={showReload} onClick={reloadPage} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert severity="info">
        <Stack direction="row" alignItems="center">
          A new version is available!
          <Link
            component="a"
            color={COLORS.white}
            onClick={reloadPage}
            sx={{
              marginLeft: 2,
              ':hover': {
                cursor: 'pointer',
                color: COLORS.white,
              },
            }}
          >
            Reload
          </Link>
        </Stack>
      </Alert>
    </Snackbar>
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

const redirect = process.env.NODE_ENV === 'development' ? _SORYBOOK : STUDY

export function Shell() {
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
