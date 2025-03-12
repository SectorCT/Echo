import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface AuthContextType {
  loggedIn: boolean;
  loading: boolean;
  login: (token: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (password: string) => Promise<void>;
  checkIfLoggedIn: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (token: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { token, password });
      const { accessToken, refreshToken } = response.data;
      await AsyncStorage.multiSet([
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
      ]);
      setLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (password: string) => {
    try {
      const response = await api.post('/auth/signup', { password });
      const { accessToken, refreshToken, token } = response.data;
      await AsyncStorage.multiSet([
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
        ['userToken', token],
      ]);
      setLoggedIn(true);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userToken']);
      setLoggedIn(false);
    } catch (error) {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userToken']);
      setLoggedIn(false);
      console.error('Logout error:', error);
      throw error;
    }
  };

  const checkIfLoggedIn = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, loading, login, logout, signup, checkIfLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 