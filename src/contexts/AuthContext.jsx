import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'employee-insights-auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const login = (email) => {
    const next = { email, role: 'analyst' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
