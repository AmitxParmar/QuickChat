import { Action, State } from "@/types/State";
import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
} from "react";

// Configuring React Context API to use global state
// React hooks: useReducer => redux store, useContext => read context from components

interface StateContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

// Higher order component which wraps the entire app
interface StateProviderProps {
  children: ReactNode;
  reducer: (state: State, action: Action) => State; // Use specific types
  initialState: State; // Use specific types
}

export const StateProvider = ({
  children,
  reducer,
  initialState,
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState); // Destructure here
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {/* Provide state and dispatch as an object */}
      {children}
    </StateContext.Provider>
  );
};

// Hook which allows to ACCESS || UPDATE global state
export const useStateProvider = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useStateProvider must be used within a StateProvider");
  }
  return context;
};
