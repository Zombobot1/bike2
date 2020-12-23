import { MouseEvent } from 'react';

const preventAndCall = (f: () => void) => (e: MouseEvent) => {
  e.preventDefault();
  f();
};

export { preventAndCall };
