import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import BottomSheet from './BottomSheet';
import { useBottomSheet } from '../context/BottomSheetContext';
import HomeViewSheet from './HomeViewSheet';
import SharePointsContent from './SharePointsContent';
import AddDishContent from './AddDishContent';
import AddCardContent from './AddCardContent';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

const isPointsData = (data: any): data is PointsData => {
  return 'title' in data && 'icon' in data && 'weekData' in data;
};

const isSharePointsData = (data: any): data is SharePointsData => {
  return 'availablePoints' in data && 'onShare' in data;
};

const DynamicBottomSheet: React.FC = () => {
  const { visible, activeSheet, closeSheet, sheetData } = useBottomSheet();

  const getSheetHeight = () => {
    switch (activeSheet) {
      case 'restaurant':
        return SCREEN_HEIGHT * 0.85; // 75% of screen height for restaurant details
      case 'home':
        return SCREEN_HEIGHT * 0.85; // 85% of screen height for home sheet
      case 'sharePoints':
        return 700; // Fixed height for share points sheet
      case 'dish':
        return SCREEN_HEIGHT * 0.90;
      case 'card':
        return SCREEN_HEIGHT * 0.70;  // 80% of screen height for dish sheet
      default:
        return SCREEN_HEIGHT * 0.5; // 50% default
    }
  };

  const renderContent = () => {
    if (!sheetData) return null;

    switch (activeSheet) {
      case 'home':
        if (isPointsData(sheetData)) {
          return <HomeViewSheet pointsData={sheetData} />;
        }
        return null;
      case 'sharePoints':
        if (isSharePointsData(sheetData)) {
          return <SharePointsContent {...sheetData} />;
        }
        return null;
      case 'dish':
        return <AddDishContent  />;
      case 'card':
        return <AddCardContent />;
      default:
        return null;
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={closeSheet}
      borderRadius={activeSheet === 'restaurant' ? 20 : 40}
      height={getSheetHeight()}
    >
      <View style={styles.content}>
        {renderContent()}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default DynamicBottomSheet; 