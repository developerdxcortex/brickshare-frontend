import { createContext, useContext, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken, setToken, clearToken } from "./api";

type AuthCtx = {
  isAuthed: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({ isAuthed: false, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(Boolean(getToken()));
  const login = (token: string) => {
    setToken(token);
    setIsAuthed(true);
  };
  const logout = () => {
    clearToken();
    setIsAuthed(false);
  };
  return <Ctx.Provider value={{ isAuthed, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
