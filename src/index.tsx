import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { QueryClient, QueryClientProvider } from 'react-query';
import { startWorker } from './api/fake-api';
import { _ROOT, PAGES, STUDY } from './components/navigation/utils';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { _SORYBOOK } from './sorybook/sorybook';
import { Snackbar, ThemeProvider, Stack, Link } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/core/Alert';
import { COLORS, theme } from './theme';
import { useIsPageVisible } from './utils/hooks-utils';
import { buildRoutes } from './components/utils/routing';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import { Global, css } from '@emotion/react';

let redirect = STUDY;

if (process.env.NODE_ENV === 'development') {
  redirect = _SORYBOOK;
  (async () => {
    await startWorker();
  })();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
    },
  },
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SWController() {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    serviceWorkerRegistration.register({ onUpdate: onSWUpdate });
  }, []);

  const isVisible = useIsPageVisible();

  useEffect(() => {
    if (isVisible)
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((reg) => reg.update().catch(console.error)));
  }, [isVisible]);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload();
  };

  return (
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
  );
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

        * {
          box-sizing: border-box;
        }
      `}
    />
  );
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalCss />
    <ThemeProvider theme={theme}>
      <Router>
        <SWController />
        <QueryClientProvider client={queryClient}>
          {/*<ReactQueryDevtools />*/}
          <Switch>
            <Redirect exact from={_ROOT} to={redirect} />
            {PAGES.map(buildRoutes)}
          </Switch>
        </QueryClientProvider>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
