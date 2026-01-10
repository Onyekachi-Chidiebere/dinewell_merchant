import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../api/axios';
import Toast from 'react-native-toast-message'
export interface MerchantStatistics {
  pointsIssuedToday: number;
  visitsToday: number;
  pointsRedeemedToday: number;
  allTimeVisits: number;
  allTimePointsIssued: number;
  allTimePointsRedeemed: number;
  recentTransactions: Array<{
    id: number;
    customerImage: string | null;
    notes: string | null;
    type: 'issue' | 'redeem';
    amount: number;
    points: number;
    dateUsed: string;
  }>;
}

export const useHome = () => {
  const { user } = useAppContext();
  const [statistics, setStatistics] = useState<MerchantStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log({statistics})
  const fetchStatistics = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/merchant/${user.id}/statistics`);
      setStatistics(response.data);
    } catch (err: any) {
      console.error('Error fetching merchant statistics:', err);
      Toast.show({
        type: 'error',
        text1: 'Statistics error',
        text2: err.response?.data?.error || 'Failed to fetch statistics'
      });
      return null
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [user?.id]);

  const refreshStatistics = () => {
    fetchStatistics();
  };

  return {
    statistics,
    loading,
    error,
    refreshStatistics,
  };
};
