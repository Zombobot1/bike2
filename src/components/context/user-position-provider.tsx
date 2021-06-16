// import React, { createContext, ReactNode, useContext, useReducer } from 'react';
// import { IdLinkP } from '../navigation/breadcrumb/breadcrumb';
//
// export type PagesInfoState = { path: IdLinkP[] };
// type PagesInfoAction = { type: 'SET'; payload: PagesInfoState } | { type: 'CLEAR' };
// type PagesInfoDispatch = (action: PagesInfoAction) => void;
// type PagesInfoProviderProps = { children: ReactNode };
//
// const defaultState = { path: [] };
// const PagesInfoStateContext = createContext<PagesInfoState>(defaultState);
// const PagesInfoDispatchContext = createContext<PagesInfoDispatch>(() => defaultState);
//
// const pagesInfoReducer = (state: PagesInfoState, action: PagesInfoAction) => {
//   switch (action.type) {
//     case 'SET':
//       return { ...action.payload };
//     case 'CLEAR':
//       return defaultState;
//   }
// };
//
// export const PagesInfoProvider = ({ children }: PagesInfoProviderProps) => {
//   const [state, dispatch] = useReducer(pagesInfoReducer, defaultState);
//   return (
//     <PagesInfoStateContext.Provider value={state}>
//       <PagesInfoDispatchContext.Provider value={dispatch}>{children}</PagesInfoDispatchContext.Provider>
//     </PagesInfoStateContext.Provider>
//   );
// };
//
// export const usePagesInfoState = () => useContext(PagesInfoStateContext);
// export const usePagesInfoDispatch = () => useContext(PagesInfoDispatchContext);

import { atom, useAtom } from 'jotai';
import { IdLinkP } from '../navigation/breadcrumb/breadcrumb';
type UserPosition = { path: IdLinkP[] };
const userPositionAtom = atom<UserPosition>({ path: [] });

export const useUserPosition = () => {
  const [position, setPosition] = useAtom(userPositionAtom);
  const setPath = (path: IdLinkP[]) => setPosition({ path });
  return { path: position.path, setPath, clearPath: () => setPath([]) };
};
