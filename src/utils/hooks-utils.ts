import { Fn } from './types';
import { useEffect } from 'react';

export const useMount = (f: Fn) => useEffect(f, []);
