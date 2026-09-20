import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { User } from "./api/types";

type AuthValue = { logout: () => void; setSession: (token: string, user: User) => void; user: User | null };
const AuthContext = createContext<AuthValue | null>(null);

function readStoredUser() {
  const raw = localStorage.getItem("campuskit-user");
  try { return raw ? JSON.parse(raw) as User : null; } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);
  const value = useMemo<AuthValue>(() => ({
    user,
    setSession: (token, nextUser) => {
      localStorage.setItem("campuskit-token", token);
      localStorage.setItem("campuskit-user", JSON.stringify(nextUser));
      setUser(nextUser);
    },
    logout: () => {
      localStorage.removeItem("campuskit-token");
      localStorage.removeItem("campuskit-user");
      setUser(null);
    }
  }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
