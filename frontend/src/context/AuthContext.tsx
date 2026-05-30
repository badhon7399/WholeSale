'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'supplier' | 'admin';
  companyName: string;
  companyAddress?: string;
  tradeLicense?: string;
  isVerified: boolean;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Clear legacy localStorage token if present to prevent mixing session strategies
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      
      try {
        // Automatically checks cookie via credentials: 'include'
        const userProfile = await api.get<User>('/auth/profile', { token: 'session' });
        setUser(userProfile);
        setToken('session');
      } catch (err) {
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post<{ user: User }>('/auth/login', { email, password });
      setToken('session');
      setUser(res.user);
    } catch (err) {
      setLoading(false);
      throw err;
    }
    setLoading(false);
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post<{ user: User }>('/auth/register', data);
      setToken('session');
      setUser(res.user);
    } catch (err) {
      setLoading(false);
      throw err;
    }
    setLoading(false);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { token: 'session' });
    } catch (err) {
      console.error('Failed to log out from server', err);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const userProfile = await api.get<User>('/auth/profile', { token: 'session' });
      setUser(userProfile);
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
