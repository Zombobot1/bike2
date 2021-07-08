import './sass/main.scss';
import 'bootstrap';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import './components/icons/icons.scss';

import { QueryClient, QueryClientProvider } from 'react-query';
import { startWorker } from './api/fake-api';
import { _ROOT, PAGES, STUDY } from './components/navigation/utils';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { _SORYBOOK } from './sorybook/sorybook';
import { Snackbar, ThemeProvider, Stack, Link, IconButton, Typography, createTheme } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/core/Alert';
import { COLORS, theme } from './theme';
import { useIsPageVisible } from './utils/hooks-utils';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import RemoveRedEyeOutlinedIcon from '@material-ui/icons/RemoveRedEyeOutlined';
import { buildRoutes } from './components/utils/routing';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';

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

export const theme2 = createTheme({ typography: { fontSize: 16 } });

const _P = () => {
  return (
    <ThemeProvider theme={theme2}>
      <IconButton color="primary">
        <MenuRoundedIcon />
      </IconButton>
      <Typography fontSize="small">
        <RemoveRedEyeOutlinedIcon sx={{ width: 15, height: 15 }} />
        {'234'}
      </Typography>
    </ThemeProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
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
