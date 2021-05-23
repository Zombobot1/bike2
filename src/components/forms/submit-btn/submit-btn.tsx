import React from 'react';
import { fn, Fn } from '../../../utils/types';

export interface SubmitBtnP {
  text?: string;
  className?: string;
  onClick?: Fn;
}

const SubmitBtn = ({ text = 'Sign in', className = '', onClick = fn }: SubmitBtnP) => (
  <button type="submit" className={'btn btn-primary ' + className} onClick={onClick}>
    {text}
  </button>
);

export default SubmitBtn;
