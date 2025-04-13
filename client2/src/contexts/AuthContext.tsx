import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { Router } from 'expo-router';

interface AuthContextType {
  loggedIn: boolean;
  loading: boolean;
  login: (token: string, password: string) => Promise<void>;
  logout: (router: Router) => Promise<void>;
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
    console.log('[AuthContext] Starting signup process');
    try {
      console.log('[AuthContext] Making signup request to API');
      const response = await api.post('/auth/signup', { password });
      console.log('[AuthContext] Signup API response received:', {
        status: response.status,
        success: response.data.status === 'success',
        hasAccessToken: !!response.data.accessToken,
        hasRefreshToken: !!response.data.refreshToken,
        hasUserToken: !!response.data.token
      });

      const { accessToken, refreshToken, token } = response.data;

      if (!accessToken || !refreshToken || !token) {
        console.error('[AuthContext] Missing required tokens:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasUserToken: !!token
        });
        throw new Error('Missing required authentication tokens');
      }

      console.log('[AuthContext] Storing tokens in AsyncStorage');
      try {
        await AsyncStorage.multiSet([
          ['accessToken', accessToken],
          ['refreshToken', refreshToken],
          ['userToken', token],
        ]);
        console.log('[AuthContext] Tokens successfully stored');
      } catch (storageError) {
        console.error('[AuthContext] Failed to store tokens:', storageError);
        throw new Error('Failed to store authentication tokens');
      }

      console.log('[AuthContext] Setting logged in state to true', loggedIn);
      setLoggedIn(true);
      console.log('[AuthContext] Signup process completed successfully');
    } catch (error) {
      console.error('[AuthContext] Signup error:', error)
    }
  };

  const logout = async (router: Router) => {
    if (!router) {
      console.error("[AuthContext] No router provided")
      return
    }
    console.log('[AuthContext] Starting logout process');
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log('[AuthContext] Sending logout request to API');
      await api.post('/auth/logout', { refreshToken });
      
      console.log('[AuthContext] Removing stored tokens');
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userToken']);
      
      console.log('[AuthContext] Setting logged out state');
      setLoggedIn(false);
      
      console.log('[AuthContext] Logout successful');
      router.navigate("/")
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      // Still clear tokens and state on error
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userToken']);
      setLoggedIn(false);
      throw error;
    }
  };

  const checkIfLoggedIn = async () => {
    console.log('[AuthContext] Starting authentication check');
    try {
      console.log('[AuthContext] Checking for access token in AsyncStorage');
      const accessToken = await AsyncStorage.getItem('accessToken');
      
      if (accessToken) {
        console.log('[AuthContext] Access token found, setting logged in state to true');
        setLoggedIn(true);
      } else {
        console.log('[AuthContext] No access token found, setting logged in state to false');
        setLoggedIn(false);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorName = error instanceof Error ? error.name : 'Unknown error type';
      const errorStack = error instanceof Error ? error.stack : 'No stack trace';
      
      console.error('[AuthContext] Error during authentication check:', {
        name: errorName,
        message: errorMessage,
        stack: errorStack
      });
      console.log('[AuthContext] Setting logged in state to false due to error');
      setLoggedIn(false);
    } finally {
      console.log('[AuthContext] Authentication check complete, setting loading to false');
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