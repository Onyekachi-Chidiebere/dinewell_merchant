import React, { createContext, useContext, ReactNode } from 'react';
import useDish from '../customHooks/useDish';

interface DishContextType {
  // Dish form state
  fields: {
    dish_name: string;
    price: string;
    points_per_dollar: string;
    base_points_per_dish: string;
  };
  dishImage: any;
  setField: (field: string, value: string) => void;
  setImage: (image: any) => void;
  reset: () => void;
  
  // Dish operations
  createDish: () => Promise<void>;
  fetchDishes: () => Promise<void>;
  
  // Dishes list
  dishes: any[];
  loading: boolean;
  error: string | null;
}

const DishContext = createContext<DishContextType | undefined>(undefined);

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

export const useDishContext = (): DishContextType => {
  const context = useContext(DishContext);
  if (context === undefined) {
    throw new Error('useDishContext must be used within a DishProvider');
  }
  return context;
};

export default DishContext;
