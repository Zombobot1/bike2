import { StrStateT } from '../../forms/hoc/with-validation';
import { useState } from 'react';

export const useSateWithOnChange = (onChange: (current: string, prev: string) => void): StrStateT => {
  const [value, setValue] = useState('');
  const [prev, setPrev] = useState('');
  if (value !== prev) {
    onChange(value, prev);
    setPrev(value);
  }
  return [value, setValue];
};
