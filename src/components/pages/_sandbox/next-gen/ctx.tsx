import React, { Context, createContext, FC, ReactNode, Reducer, useContext, useReducer } from 'react';

// inspired by https://kentcdodds.com/blog/how-to-use-react-context-effectively

// hack: undefined is used because we don't know dispatcher when we create context
type DispatchableContext<State, Dispatch> = { state: State; dispatch: Dispatch };
type Dispatch<Actions> = (action: Actions) => void;
type ContextWithActions<State, Actions> = Context<DispatchableContext<State, Dispatch<Actions>> | undefined>;

const makeContext = <Actions, StateClass>(): ContextWithActions<StateClass, Actions> => {
  return createContext<DispatchableContext<StateClass, Dispatch<Actions>> | undefined>(undefined);
};

type ContextProviderProps = { children: ReactNode };
type FCP = FC<ContextProviderProps>;

export const hookAndProvider = <Actions, StateClass>(
  defaultState: StateClass,
  reducer: Reducer<StateClass, Actions>,
): [() => DispatchableContext<StateClass, Dispatch<Actions>>, FCP] => {
  const Context = makeContext<Actions, StateClass>();
  const Provider = ({ children }: ContextProviderProps) => {
    const [state, dispatch] = useReducer(reducer, defaultState);
    return <Context.Provider value={{ state: state as StateClass, dispatch }}>{children}</Context.Provider>;
  };

  const useInitializedContext = () => {
    const context = useContext(Context);
    if (!context) throw new Error('Context was not initialized');
    return context;
  };

  return [() => useInitializedContext(), Provider];
};
