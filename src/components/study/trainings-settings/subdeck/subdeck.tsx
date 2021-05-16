import './subdeck.scss';
import { useToggle } from '../../../utils/hooks/use-toggle';
import { cn } from '../../../../utils/utils';
import React from 'react';

export interface SubdeckP {
  name: string;
  split: (v: string) => void;
  merge: (v: string) => void;
}

const Subdeck = ({ name, split, merge }: SubdeckP) => {
  const [value, toggle] = useToggle(true);
  const onClick = () => {
    if (value) merge(name);
    else split(name);
    toggle();
  };
  return (
    <li
      className={cn('list-group-item d-flex justify-content-between subdeck', { excluded: !value })}
      onClick={onClick}
    >
      <span className="deck-name">{name}</span>
      <input className="form-check-input" type="checkbox" checked={value} readOnly />
    </li>
  );
};

export default Subdeck;
