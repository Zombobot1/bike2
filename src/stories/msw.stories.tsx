import React, { useEffect } from 'react';
import { Meta } from '@storybook/react';
import { rest, setupWorker } from 'msw';

(async () => {
  const worker = setupWorker(
    rest.get('http://localhost:5000/ping', (req, res, ctx) => {
      return res(ctx.json(['pong']));
    }),
  );
  await worker.start();
})();

const T = () => {
  useEffect(() => {
    fetch('http://localhost:5000/ping').catch(console.log);
  }, []);
  return <div>Div</div>;
};

export default {
  title: 'MSW/MSW',
  component: T,
} as Meta;

export const Example = T.bind({});
