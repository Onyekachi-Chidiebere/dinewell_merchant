import React, { useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';
import {
  SearchIcon,
  NotificationIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
} from '../assets/icons';
import WalletCard from '../components/WalletCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from '../api/axios';
import { useAppContext } from '../context/AppContext';
import Toast from 'react-native-toast-message';



type WalletScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BottomTab'>;

interface WalletScreenProps {
  navigation: WalletScreenNavigationProp;
}

interface Transaction {
  id: string;
  type: 'debit' | 'reversal';
  description: string;
  cardNumber?: string;
  customer?: string;
  points?: number;
  amount: number;
}

interface TransactionGroup {
  id: string;
  date: string;
  transactions: Transaction[];
}

const WalletScreen = ({ navigation }: WalletScreenProps) => {
  const { user } = useAppContext();
  const [transactions, setTransactions] = useState<TransactionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/restaurants/${user.id}/payments/history`);
      setTransactions(response.data || []);
    } catch (err: any) {
      console.error('Error fetching payment history:', err);
      setError(err.response?.data?.error || 'Failed to fetch transactions');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.error || 'Failed to fetch transactions'
      });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchTransactions();
  }, [user?.id]);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Search and Notification */}
        <View style={styles.headerTop}>
          <View style={styles.searchContainer}>
            <SearchIcon width={20} height={20} color={colors.text.tertiary} />
            <Text style={styles.searchText}>Search here</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <NotificationIcon width={24} height={24} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>
        <WalletCard />
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => navigation.navigate('ManageCards')} style={styles.cardAction}>
            <Text style={styles.cardActionText}>Manage Cards</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Transactions */}
      <ScrollView >
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={colors.primary.main} />
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchTransactions}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No payment transactions found</Text>
            </View>
          ) : (
            transactions.map((transactionGroup) => (
              <React.Fragment key={transactionGroup.id}>
                <View style={styles.dateTag}>
                  <Text style={styles.dateTagText}>{transactionGroup.date}</Text>
                </View>
                {transactionGroup.transactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionLeft}>
                      <View style={[styles.iconContainer, transaction.type === 'debit' ? styles.debitIconBg : styles.topupIconBg]}>
                        {transaction.type === 'debit' ? <ArrowUpRightIcon color="#FC4C5D" /> : <ArrowDownLeftIcon color="#2FB763" />}
                      </View>
                      <View>
                        <Text style={styles.transactionType}>{transaction.description}</Text>
                        <Text style={styles.transactionCustomer}>{transaction.cardNumber || transaction.customer || 'N/A'}</Text>
                      </View>
                    </View>
                    <View style={styles.transactionRight}>
                      {transaction.points && <Text style={styles.transactionPoints}>{transaction.points} Pts</Text>}
                      <View style={styles.amountContainer}>
                        <Text style={styles.transactionAmount}>${transaction.amount.toFixed(2)}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </React.Fragment>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
  dateTag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  dateTagText: {
    ...typography.body2,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: 40,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  debitIconBg: {
    backgroundColor: '#FFEEF1',
  },
  topupIconBg: {
    backgroundColor: '#E6FBEE',
  },
  transactionType: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  transactionCustomer: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionPoints: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  amountContainer: {
    backgroundColor: '#FCEFE3',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  transactionAmount: {
    ...typography.body2,
    color: '#4B5563',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    backgroundColor: '#F6F8FA',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EBEEFF',
  },
  searchText: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 10,
    lineHeight: 12,
    color: colors.text.primary,
  },
  notificationButton: {
    padding: 4,
    backgroundColor: '#F6F8FA',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EBEEFF',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 10,
  },
  cardAction: {
    backgroundColor: colors.background.paper,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  cardActionText: {
    ...typography.body2,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loadingText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginTop: 12,
  },
  errorText: {
    ...typography.body1,
    color: colors.status.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 16,
  },
  retryButtonText: {
    ...typography.body1,
    color: colors.text.white,
    fontWeight: '600',
  },
});

export default WalletScreen;