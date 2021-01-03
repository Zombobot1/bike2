import { useHistory } from 'react-router-dom';
import React from 'react';

export interface BLinkP {
  className: string;
  to: string;
  text: string;
}

export const BLink = ({ className, text, to }: BLinkP) => {
  const history = useHistory();
  return (
    <button className={className} onClick={() => history.push(to)}>
      {text}
    </button>
  );
};
