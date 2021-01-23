import React, { FC } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { _ROOT, _SANDBOX, _PAGE404 } from '../pages';

export type Routed = {
  routes?: RouteT[];
};

type RouteT = {
  path: string;
  component: FC<Routed>;
  routes?: RouteT[];
};

const RouteWithSubRoutes = (route: RouteT) => {
  return (
    <Route
      path={route.path}
      render={() => {
        if (route.routes) return <route.component routes={route.routes} />;
        return <route.component />;
      }}
    />
  );
};

export const buildRoutes = (route: RouteT, i: number) => <RouteWithSubRoutes key={i} {...route} />;

export const Redirect404 = () => <Redirect to={_PAGE404} />;

export const RootRedirect = () => <Redirect from={_ROOT} to={_SANDBOX} />;

export const DebugRouter = ({ children }: { children: any }) => {
  const history = useHistory();
  // if (process.env.NODE_ENV === 'development')
  // console.debug(`Route: ${location.pathname}${location.search}, State: ${JSON.stringify(location.state)}`);
  history.listen((location, action) => {
    console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`);
    console.log(`The last navigation action was ${action}`, JSON.stringify(history, null, 2));
  });
  return children;
};
