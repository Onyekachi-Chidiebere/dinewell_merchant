import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useLogin from '../customHooks/useLogin';
import { io, Socket } from 'socket.io-client';
import { BACKEND_URL } from '../theme/constants';
import axios from '../api/axios';
import {
  isBiometricEnabled,
  removeLoginCredentials,
  saveLoginCredentials,
} from '../services/biometricAuth';
import Toast from 'react-native-toast-message';

function resolveApprovalStatus(userData) {
  if (!userData) return 'pending';
  if (userData.approvalStatus) return userData.approvalStatus;
  if (userData.approval_status === 1) return 'active';
  if (userData.approval_status === -1) return 'disabled';
  return 'pending';
}
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
      const storedUser = await AsyncStorage.getItem('dinewell_merchant_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({
          ...parsed,
          approvalStatus: resolveApprovalStatus(parsed),
        });
      }
    } catch (err) {
      console.error('Failed to load user from storage:', err);
    }
  };

  const saveUserToStorage = async (userData: any) => {
    try {
      await AsyncStorage.setItem('dinewell_merchant_user', JSON.stringify(userData));
    } catch (err) {
      console.error('Failed to save user to storage:', err);
    }
  };

  const removeUserFromStorage = async () => {
    try {
      await AsyncStorage.removeItem('dinewell_merchant_user');
    } catch (err) {
      console.error('Failed to remove user from storage:', err);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const data = await loginRequest(credentials);
    const normalizedUser = {
      ...data,
      approvalStatus: resolveApprovalStatus(data),
    };
    setUser(normalizedUser);
    await saveUserToStorage(normalizedUser);

    if (normalizedUser.approvalStatus === 'pending') {
      Toast.show({
        type: 'info',
        text1: 'Pending approval',
        text2: 'Your restaurant is under review. We will notify you once verified.',
      });
    }

    if (
      credentials.email &&
      credentials.password &&
      (await isBiometricEnabled())
    ) {
      await saveLoginCredentials(credentials.email.trim(), credentials.password);
    }

    return normalizedUser;
  };

  const refreshApprovalStatus = useCallback(async () => {
    if (!user?.id) return null;
    const response = await axios.get(`/merchant/${user.id}/approval-status`);
    const nextStatus = response.data?.approvalStatus || resolveApprovalStatus(response.data);
    const updatedUser = {
      ...user,
      approval_status: response.data?.approval_status ?? user.approval_status,
      approvalStatus: nextStatus,
      restaurant_name: response.data?.restaurant_name ?? user.restaurant_name,
    };
    setUser(updatedUser);
    await saveUserToStorage(updatedUser);
    return updatedUser;
  }, [user]);

  useEffect(() => {
    if (!user?.id || resolveApprovalStatus(user) !== 'active') {
      setSocket(null);
      return;
    }

    const newSocket = io(BACKEND_URL as string, {
      transports: ['websocket'],
      query: { userId: user.id },
    });
    setSocket(newSocket);
    return () => {
      try {
        newSocket.disconnect();
      } catch {}
      setSocket(null);
    };
  }, [user?.id, user?.approvalStatus, user?.approval_status]);

  const logout = async () => {
    try {
      setUser(null);
      await removeUserFromStorage();
      await removeLoginCredentials();
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
    () => ({
      user,
      login,
      logout,
      loginLoading,
      loginError,
      socket,
      updateUser,
      refreshApprovalStatus,
      isRestaurantApproved: resolveApprovalStatus(user) === 'active',
      isRestaurantPending: resolveApprovalStatus(user) === 'pending',
    }),
    [user, loginLoading, loginError, socket, refreshApprovalStatus]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
