import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/index.ts';
import {
  loginApi,
  registerApi,
  getMeApi,
  switchRoleApi,
  getStoredToken,
  setStoredToken,
} from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  quickLoginDemo: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from stored token or auto-authenticate default analyst
  useEffect(() => {
    async function initAuth() {
      const stored = getStoredToken();
      if (stored) {
        try {
          const res = await getMeApi();
          setUser(res.user);
          setToken(stored);
          setIsLoading(false);
          return;
        } catch (err) {
          console.warn('Stored token expired or invalid:', err);
          setStoredToken(null);
          setToken(null);
        }
      }

      // Automatically log in as default Security Analyst for effortless instant interaction
      try {
        const demoRes = await loginApi('analyst@trustguard.ai', 'AnalystPass123!');
        setStoredToken(demoRes.token);
        setToken(demoRes.token);
        setUser(demoRes.user);
      } catch (err) {
        console.warn('Could not auto-login demo account:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginApi(email, password);
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await registerApi(name, email, password, role);
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
  };

  const switchRole = async (role: UserRole) => {
    if (!user) return;
    try {
      const res = await switchRoleApi(role);
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (err) {
      console.error('Failed to switch role:', err);
    }
  };

  const quickLoginDemo = async (email: string) => {
    let password = 'AnalystPass123!';
    if (email.startsWith('admin')) password = 'AdminPass123!';
    if (email.startsWith('dev')) password = 'DevPass123!';
    await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        quickLoginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
