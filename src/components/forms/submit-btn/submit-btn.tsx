import React from 'react';

export interface SubmitBtnP {
  text?: string;
  className?: string;
}

const SubmitBtn = ({ text = 'Sign in', className = '' }: SubmitBtnP) => (
  <button type="submit" className={'btn btn-primary ' + className}>
    {text}
  </button>
);

export default SubmitBtn;
