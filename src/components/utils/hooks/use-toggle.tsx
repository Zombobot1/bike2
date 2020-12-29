import { useReducer } from 'react';

export const useToggle = (init: boolean) => useReducer((prev) => !prev, init);
