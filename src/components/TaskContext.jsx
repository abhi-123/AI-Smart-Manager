import { createContext, useReducer } from "react";
import { initialState, taskReducer } from "../taskReducer";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
