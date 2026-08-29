import React, { createContext, useContext, ReactNode } from 'react';
import useDish from '../customHooks/useDish';

const DishContext = createContext<any>(undefined);

interface DishProviderProps {
  children: ReactNode;
}

export const DishProvider: React.FC<DishProviderProps> = ({ children }) => {
  const dishHook = useDish();

  return (
    <DishContext.Provider value={dishHook}>
      {children}
    </DishContext.Provider>
  );
};

export const useDishContext = () => {
  const context = useContext(DishContext);
  if (context === undefined) {
    throw new Error('useDishContext must be used within a DishProvider');
  }
  return context;
};

export default DishContext;
