import { FC } from 'react';
import { Route } from 'react-router-dom';

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
