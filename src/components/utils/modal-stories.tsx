import React, { memo, useState } from 'react';
import { Modal, ModalTrigger } from './modal';
import { useInterval } from './hooks/use-interval';

export interface ModalTP {
  title: string;
  bodyText: string;
  rerenderInterval?: number;
}

const ModalMemoized = memo(
  function ({ title, bodyText }: ModalTP) {
    const SimpleModal = Modal('id', title, () => <h3>{bodyText}</h3>);
    return (
      <>
        <ModalTrigger modalId={'id'} text={'Show'} />
        <SimpleModal />
      </>
    );
  },
  () => true,
);

export const ModalT = ({ title, bodyText, rerenderInterval }: ModalTP) => {
  const [rerenderNumber, setRerenderNumber] = useState(0);
  useInterval(() => setRerenderNumber((p) => p + 1), rerenderInterval ? rerenderInterval : 1e9);

  return (
    <div
      className="bg-light d-flex flex-column justify-content-center align-items-center pt-3"
      style={{ width: '200px', minHeight: '100px' }}
    >
      <ModalMemoized title={title} bodyText={bodyText} />
      <p className="mt-3">Rerender number: {rerenderNumber}</p>
    </div>
  );
};

export const hidesWithoutWasteInDOMA: ModalTP = {
  title: 'Simple modal',
  bodyText: 'Hello from modal',
};

export const survivesRerendersA: ModalTP = {
  title: 'Simple modal',
  bodyText: 'Hello from modal',
  rerenderInterval: 1e3,
};
