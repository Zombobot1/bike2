import { atom, useAtom } from 'jotai';
import { LinkName } from './breadcrumb';
type UserPosition = { path: LinkName[] };
const userPositionAtom = atom<UserPosition>({ path: [] });

export const useUserPosition = () => {
  const [position, setPosition] = useAtom(userPositionAtom);
  const setPath = (path: LinkName[]) => setPosition({ path });
  return { path: position.path, setPath, clearPath: () => setPath([]) };
};
