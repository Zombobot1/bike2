import { useEffect } from 'react';

export const useInterval = (callback: () => void, delay: number) => {
  useEffect(() => {
    const newId = setInterval(callback, delay);
    return () => clearInterval(newId);
  }, [delay]);
};
