import { AlertFC } from '../alert';
import React, { FC, useState } from 'react';

export const withAlert = (Alert: AlertFC) => (Base: FC) => () => {
  const [visible] = useState(false);
  return (
    <>
      <Alert isVisible={visible} />
      <Base />
    </>
  );
};
