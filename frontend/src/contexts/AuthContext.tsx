import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, AuthState, UserRole } from '../types';
import { API_URL } from '../config';

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      if (authState.token) {
        try {
          const res = await axios.get(`${API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${authState.token}`
            }
          });
          
          setAuthState({
            ...authState,
            user: res.data,
            loading: false
          });
        } catch (err) {
          localStorage.removeItem('token');
          setAuthState({
            user: null,
            token: null,
            loading: false,
            error: 'Session expired. Please login again.'
          });
        }
      } else {
        setAuthState({
          ...authState,
          loading: false
        });
      }
    };

    loadUser();
  }, [authState.token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      
      localStorage.setItem('token', res.data.token);
      
      setAuthState({
        user: res.data.user,
        token: res.data.token,
        loading: false,
        error: null
      });
    } catch (err: any) {
      setAuthState({
        ...authState,
        error: err.response?.data?.message || 'Login failed. Please try again.'
      });
    }
  };

  const register = async (username: string, email: string, password: string, role: UserRole) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { username, email, password, role });
      
      localStorage.setItem('token', res.data.token);
      
      setAuthState({
        user: res.data.user,
        token: res.data.token,
        loading: false,
        error: null
      });
    } catch (err: any) {
      setAuthState({
        ...authState,
        error: err.response?.data?.message || 'Registration failed. Please try again.'
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      token: null,
      loading: false,
      error: null
    });
  };

  return (
    <AuthContext.Provider value={{
      user: authState.user,
      token: authState.token,
      loading: authState.loading,
      error: authState.error,
      login,
      register,
      logout
    }}>
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