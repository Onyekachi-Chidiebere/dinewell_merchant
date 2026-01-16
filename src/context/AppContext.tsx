import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useLogin from '../customHooks/useLogin';
import { io, Socket } from 'socket.io-client';
import { BACKEND_URL } from '../theme/constants';
const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { login: loginRequest, loading: loginLoading, error: loginError } = useLogin();
  const [user, setUser] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Load user from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('merchant_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to load user from storage:', err);
    }
  };

  const saveUserToStorage = async (userData: any) => {
    try {
      await AsyncStorage.setItem('merchant_user', JSON.stringify(userData));
    } catch (err) {
      console.error('Failed to save user to storage:', err);
    }
  };

  const removeUserFromStorage = async () => {
    try {
      await AsyncStorage.removeItem('merchant_user');
    } catch (err) {
      console.error('Failed to remove user from storage:', err);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const data = await loginRequest(credentials);
    setUser(data);
    await saveUserToStorage(data);
    return data;
  };

  useEffect(() => {
    if (user?.id) {
        const newSocket = io(BACKEND_URL as string, {
            transports: ['websocket'],
            query: { userId: user.id },
        });
        setSocket(newSocket);
        return () => {
          try { newSocket.disconnect(); } catch {}
        };
    }
}, [user]);

  const logout = async () => {
    try {
      setUser(null);
      await removeUserFromStorage();
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const updateUser = (userData: any) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  const value = useMemo(
    () => ({ user, login, logout, loginLoading, loginError, socket, updateUser }),
    [user, loginLoading, loginError, socket]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
