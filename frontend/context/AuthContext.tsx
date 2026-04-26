'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'guru' | 'siswa';
  class_name?: string;
  profile_photo_url?: string;
}

interface AuthContextType {
 user: User | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage and validate token
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (savedUser && token) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            
            // Verify token is still valid by making a role-appropriate request
            try {
              if (parsedUser.role === 'siswa') {
                await api.dashboard.siswaStats();
              } else if (parsedUser.role === 'guru') {
                await api.dashboard.guruStats();
              } else if (parsedUser.role === 'admin') {
                await api.dashboard.adminStats();
              }
              console.log('[AuthContext] Token validated for', parsedUser.role);
            } catch (error) {
              console.warn('[AuthContext] Token validation failed, clearing auth:', error);
              logout();
            }
          } catch (error) {
            console.error('[AuthContext] Failed to parse user:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newUser: User, token: string) => {
    console.log('[AuthContext] Logging in user:', newUser);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    console.log('[AuthContext] Logging out');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Call API logout for server-side session cleanup (fire and forget)
    api.logout().catch(error => {
      // Silently ignore logout API errors - user is already logged out locally
      console.debug('[AuthContext] API logout failed (expected if token was invalid):', error);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
