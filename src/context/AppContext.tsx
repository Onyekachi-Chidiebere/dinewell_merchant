import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import useLogin from '../customHooks/useLogin';
import { io, Socket } from 'socket.io-client';
import { BACKEND_URL } from '../theme/constants';
const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { login: loginRequest, loading: loginLoading, error: loginError } = useLogin();
  const [user, setUser] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const login = async (credentials: { email: string; password: string }) => {
    const data = await loginRequest(credentials);
    setUser(data);
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
  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, login, logout, loginLoading, loginError, socket }),
    [user, loginLoading, loginError, socket]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
