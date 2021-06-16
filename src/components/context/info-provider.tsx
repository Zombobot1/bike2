import appData from '../../content';
import { atom, useAtom } from 'jotai';

const appDataAtom = atom(appData);

export const useInfo = () => {
  const [appData] = useAtom(appDataAtom);
  return { info: appData };
};
