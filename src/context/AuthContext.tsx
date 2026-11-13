import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';
import { api, setAuthToken, getAuthToken } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; address?: any }) => Promise<void>;
  logout: () => void;
  quickLoginAs: (role: UserRole) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('novamart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setTokenState] = useState<string | null>(getAuthToken);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      const currentToken = getAuthToken();
      if (!currentToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.auth.getProfile();
        setUser(res.user);
        localStorage.setItem('novamart_user', JSON.stringify(res.user));
      } catch (err) {
        console.warn('Session expired or invalid, logging out.');
        logout();
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      localStorage.setItem('novamart_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; address?: any }) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(data);
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      localStorage.setItem('novamart_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
    localStorage.removeItem('novamart_user');
  };

  const quickLoginAs = async (role: UserRole) => {
    if (role === 'admin') {
      await login('admin@novamart.com', 'admin123');
    } else {
      await login('user@novamart.com', 'user123');
    }
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await api.auth.getProfile();
      setUser(res.user);
      localStorage.setItem('novamart_user', JSON.stringify(res.user));
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    register,
    logout,
    quickLoginAs,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
