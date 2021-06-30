import './app.scss';
import React, { useEffect, useState } from 'react';
import { Switch } from 'react-router-dom';

import { buildRoutes, Routed } from '../utils/routing';
import Breadcrumb from '../navigation/breadcrumb';
import { getToken, UNotification } from '../../firebase';
import { subscribeForNotifications } from '../../api/api';
import { useMount } from '../../utils/hooks-utils';

const App = ({ routes }: Routed) => {
  const [n, sn] = useState<UNotification>({ body: '', title: '' });
  useMount(() => getToken(sn).then(subscribeForNotifications).catch(console.error));

  useEffect(() => {
    if (n.title) window.alert(`title: ${n.title}, body: ${n.body}`);
  }, [n]);

  return (
    <>
      <Breadcrumb />
      <main className="content-area">
        <Switch>{routes?.map(buildRoutes)}</Switch>
      </main>
    </>
  );
};

export default App;
