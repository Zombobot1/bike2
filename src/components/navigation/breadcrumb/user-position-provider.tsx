import { atom, useAtom } from 'jotai';
import { IdLinkP } from './breadcrumb';
type UserPosition = { path: IdLinkP[] };
const userPositionAtom = atom<UserPosition>({ path: [] });

export const useUserPosition = () => {
  const [position, setPosition] = useAtom(userPositionAtom);
  const setPath = (path: IdLinkP[]) => setPosition({ path });
  return { path: position.path, setPath, clearPath: () => setPath([]) };
};
