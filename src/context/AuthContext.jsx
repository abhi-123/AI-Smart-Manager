import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuth(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
  };
  return (
    <AuthContext.Provider value={{ login, logout, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
