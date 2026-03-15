import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'employee_dashboard_auth';
const VALID_USERNAME = 'testuser';
const VALID_PASSWORD = 'Test123';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  });

  const login = useCallback((username, password) => {
    const valid = username === VALID_USERNAME && password === VALID_PASSWORD;
    if (valid) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials.' };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
