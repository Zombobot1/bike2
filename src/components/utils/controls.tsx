import React from 'react';
import Button from '@material-ui/core/Button';
import { Fn } from '../../utils/types';

export interface Btn {
  text: string;
  type?: 'contained' | 'outlined' | 'text';
  size?: 'medium' | 'large';
  onClick?: Fn;
}

export function Btn({ text, size = 'medium', type = 'contained', onClick }: Btn) {
  return (
    <Button variant={type} size={size} onClick={onClick}>
      {text}
    </Button>
  );
}
