import React, { FC } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { _PAGE404 } from '../pages';

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
