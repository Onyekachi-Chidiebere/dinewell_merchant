import React, { createContext, useContext, ReactNode } from 'react';
import useSignup from '../customHooks/useSignup';

const SignupContext = createContext<any>(null);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const signup = useSignup();
  return (
    <SignupContext.Provider value={signup}>{children}</SignupContext.Provider>
  );
};

export const useSignupContext = () => {
  const ctx = useContext(SignupContext);
  if (!ctx) {
    throw new Error('useSignupContext must be used within a SignupProvider');
  }
  return ctx;
};
