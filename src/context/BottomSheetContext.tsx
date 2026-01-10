import React, { createContext, useContext, useState, useCallback } from 'react';

type BottomSheetType = 'home' | 'restaurant' | 'sharePoints' | 'dish' |'card';

interface PointsData {
  title: string;
  icon: React.ComponentType<{ width: number; height: number }>;
  totalPoints: number;
  thisWeek: number;
  weekData: Array<{
    date: string;
    dayName: string;
    transactions: Array<{
      id: string;
      points: number;
      restaurant: string;
      order: number;
    }>;
  }>;
}

interface RestaurantData {
  id: string;
  name: string;
  location: string;
  image: any;
  logo: any;
  rating: number;
  points: number;
  distance: string;
  category: string;
}

interface SharePointsData {
  availablePoints: number;
  onShare: (points: number, phoneNumber: string) => void;
}

interface DishSheetData {
  // placeholder for any prefilled data; can be empty for create
}
interface CardSheetData {
  // placeholder for any prefilled data; can be empty for create
}

interface BottomSheetContextType {
  visible: boolean;
  activeSheet: BottomSheetType | null;
  sheetData: PointsData | RestaurantData | SharePointsData | DishSheetData | CardSheetData | null;
  openSheet: (type: BottomSheetType, data: PointsData | RestaurantData | SharePointsData | DishSheetData | DishSheetData) => void;
  closeSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return {
    ...context,
    openHomeSheet: (data: PointsData) => context.openSheet('home', data),
    openSharePointsSheet: (data: SharePointsData) => context.openSheet('sharePoints', data),
    openDishSheet: (data: DishSheetData = {}) => context.openSheet('dish', data),
    openCardSheet: (data: CardSheetData) => context.openSheet('card', data),
  };
};

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [activeSheet, setActiveSheet] = useState<BottomSheetType | null>(null);
  const [sheetData, setSheetData] = useState<PointsData | RestaurantData | SharePointsData | DishSheetData | null>(null);

  const openSheet = useCallback((type: BottomSheetType, data: PointsData | RestaurantData | SharePointsData | DishSheetData) => {
    setSheetData(data);
    setActiveSheet(type);
    setVisible(true);
  }, []);

  const closeSheet = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setActiveSheet(null);
      setSheetData(null);
    }, 300); // Clear data after animation completes
  }, []);

  return (
    <BottomSheetContext.Provider
      value={{
        visible,
        activeSheet,
        sheetData,
        openSheet,
        closeSheet,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
}; 