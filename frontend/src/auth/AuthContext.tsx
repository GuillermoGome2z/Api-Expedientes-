import { createContext, useContext, useState,useEffect } from "react";
import type { ReactNode } from "react"; 
import type { User } from "../api/auth.api";

type Ctx = { user: User|null; token: string|null; login:(t:string,u:User)=>void; logout:()=>void; };
const AuthCtx = createContext<Ctx>({} as Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string|null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User|null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );

  const login = (t:string, u:User) => {
    setToken(t); setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // sincronizar entre pestañas
  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
      setUser(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <AuthCtx.Provider value={{ user, token, login, logout }}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);
