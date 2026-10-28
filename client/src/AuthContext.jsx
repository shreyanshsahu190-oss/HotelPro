import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = (payload) => {
    const data = { token: payload.token, ...payload.user };
    localStorage.setItem("user", JSON.stringify(data));
    setSession(data);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setSession(null);
  };

  useEffect(() => {
    const handleExpired = () => setSession(null);
    window.addEventListener("auth-expired", handleExpired);
    return () => window.removeEventListener("auth-expired", handleExpired);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session,
      isLoggedIn: Boolean(session?.token),
      isAdmin: session?.userType === "Admin",
      login,
      logout,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
