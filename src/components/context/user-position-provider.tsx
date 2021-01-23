import React, { ReactNode, createContext, useReducer, useContext } from 'react';

type PagesInfoAction = { type: 'ADD'; payload: string[] } | { type: 'CLEAR' };
type PagesInfoDispatch = (action: PagesInfoAction) => void;
export type PagesInfoState = { [p: string]: string };
type PagesInfoProviderProps = { children: ReactNode };

const PagesInfoStateContext = createContext<PagesInfoState>({});
const PagesInfoDispatchContext = createContext<PagesInfoDispatch>(() => ({}));

const pagesInfoReducer = (state: PagesInfoState, action: PagesInfoAction) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, [action.payload[0]]: action.payload[1] };
    case 'CLEAR':
      return {};
  }
};

export const PagesInfoProvider = ({ children }: PagesInfoProviderProps) => {
  const [state, dispatch] = useReducer(pagesInfoReducer, {});
  return (
    <PagesInfoStateContext.Provider value={state}>
      <PagesInfoDispatchContext.Provider value={dispatch}>{children}</PagesInfoDispatchContext.Provider>
    </PagesInfoStateContext.Provider>
  );
};

export const usePagesInfoState = () => useContext(PagesInfoStateContext);
export const usePagesInfoDispatch = () => useContext(PagesInfoDispatchContext);
