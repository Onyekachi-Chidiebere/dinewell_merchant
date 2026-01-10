import { ComponentType } from 'react';

export interface PointsData {
  pointsBalance: number;
  pointsEarned: number;
  pointsRedeemed: number;
  pointsToNextTitle: number;
  nextTitleName: string;
}

export interface WeeklyStats {
  pointsEarned: number;
  restaurantsVisited: number;
}

export interface PointsTransaction {
  id: string;
  restaurant: string;
  type: 'issued' | 'redeemed';
  amount: number;
  points: number;
  description: string;
  timestamp: Date;
}

export interface PointsSheetData {
  title: string;
  icon: ComponentType<{ width: number; height: number }>;
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