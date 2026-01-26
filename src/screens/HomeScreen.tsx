import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types/navigation';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageStyle,
  ViewStyle,
  TextStyle,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { PointsData, WeeklyStats, PointsTransaction } from '../types/points';
import colors from '../theme/colors';
import typography, { fontFamily } from '../theme/typography';
import icons from '../theme/icons';
import Filter from '../assets/icons/filter.svg';
import Bell from '../assets/icons/notification_bell.svg';
import Designation from '../assets/icons/designation.svg';
import Operations from '../assets/icons/operations.svg';
import Share from '../assets/icons/sharepoints.svg';
import Refer from '../assets/icons/refer.svg';
import SpecialOffers from '../assets/icons/special-offers.svg';
import DashBackground from '../assets/icons/dash-background.svg';
import GreyBackground from '../assets/icons/grey-background.svg';
import { useAppContext } from '../context/AppContext';
import { useHome } from '../customHooks/useHome';

const mockData: PointsData = {
  pointsBalance: 0,
  pointsEarned: 0,
  pointsRedeemed: 0,
  pointsToNextTitle: 0,
  nextTitleName: '',
};

const mockWeeklyStats: WeeklyStats = {
  pointsEarned: 0,
  restaurantsVisited: 0,
};



interface PointsSheetData {
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



const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAppContext();
  const { statistics, loading, error, refreshStatistics } = useHome();

  // Convert statistics to the format expected by the UI
  const pointsData: PointsData = statistics ? {
    pointsBalance: statistics.allTimePointsIssued - statistics.allTimePointsRedeemed,
    pointsEarned: statistics.allTimePointsIssued,
    pointsRedeemed: statistics.allTimePointsRedeemed,
    pointsToNextTitle: 0, // This would need to be calculated based on business logic
    nextTitleName: 'Points Master',
  } : mockData;

  const weeklyStats: WeeklyStats = statistics ? {
    pointsEarned: statistics.pointsIssuedToday,
    restaurantsVisited: statistics.visitsToday,
  } : mockWeeklyStats;

  // Convert recent transactions to the expected format
  const recentTransactions: PointsTransaction[] = statistics ? 
    statistics.recentTransactions.map(transaction => ({
      id: transaction.id.toString(),
      points: transaction.points,
      type: transaction.type === 'issue' ? 'issued' : 'redeemed',
      amount: transaction.amount,
      description: transaction.notes || `${transaction.type === 'issue' ? 'Points Issued' : 'Points Redeemed'}`,
      restaurant: 'Customer', // We don't have restaurant name in the transaction data
      timestamp: new Date(transaction.dateUsed),
    })) : [];
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Pressable style={styles.retryButton} onPress={refreshStatistics}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{uri:user.restaurant_logo}}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Hi!</Text>
              <Text style={styles.userName}>{user.restaurant_name}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell width={20} height={20} />
          </TouchableOpacity>
        </View>

        {/* Points Balance Card */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsBackground}>
            <DashBackground />
          </View>
          <View style={styles.pointsHeader}>
            {/* <Text style={styles.pointsLabel}>Points Balance</Text>
            <View style={styles.pointsValue}>
              <Text style={[styles.pointsUnit, { color: 'transparent' }]}>PTS</Text>
              <Text style={styles.pointsNumber}>{pointsData.pointsBalance}</Text>
              <Text style={styles.pointsUnit}>PTS</Text>
            </View> */}
          </View>

          <View style={styles.pointsStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Points Issued</Text>
              <Text style={styles.statValue}>{pointsData.pointsEarned} PTS</Text>
            </View>
            <View style={[styles.statItem, { alignItems: 'flex-end' }]}>
              <Text style={styles.statLabel}>Points Redeemed</Text>
              <Text style={styles.statValue}>{pointsData.pointsRedeemed} PTS</Text>
            </View>
          </View>
        </View>


        <View style={styles.nextTitleInfo}>
          <Pressable onPress={() => navigation.navigate('ManagePoints', { type: 'Issue' })} style={styles.nextTitleInfoText}>

            <Refer />
            <Text style={styles.nextTitleInfoTextText}>Issue Points</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('ManagePoints', { type: 'Redeem' })} style={styles.nextTitleInfoText}>
            <Share />
            <Text style={styles.nextTitleInfoTextText}>Redeem Points</Text>
          </Pressable>
          {/* <Pressable onPress={() => navigation.navigate('Topup')} style={styles.nextTitleInfoText}>
            <SpecialOffers />
            <Text style={styles.nextTitleInfoTextText}>Top Up</Text>
          </Pressable> */}
        </View>


        <View style={styles.filterRowContainer}>
          <View style={styles.filterRow}>
            <View style={styles.filterRowBackground}>
              <GreyBackground />
            </View>
            <Text style={styles.filterRowText}>POINTS ISSUED TODAY</Text>
            <Text style={styles.filterRowCount}>{statistics?.pointsIssuedToday}</Text>
          </View>
          <Pressable style={styles.filterButton}><Filter /></Pressable>
        </View>
        <View style={styles.filterRowContainer}>
          <View style={styles.filterRow}>
            <View style={styles.filterRowBackground}>
              <GreyBackground />
            </View>
            <Text style={styles.filterRowText}>VISITS TODAY</Text>
            <Text style={styles.filterRowCount}>{statistics?.visitsToday}</Text>
          </View>
          <Pressable style={styles.filterButton}><Filter /></Pressable>
        </View>
        <View style={styles.filterRowContainer}>
          <View style={styles.filterRow}>
            <View style={styles.filterRowBackground}>
              <GreyBackground />
            </View>
            <Text style={styles.filterRowText}>POINTS REDEEMED TODAY</Text>
            <Text style={styles.filterRowCount}>{statistics?.pointsRedeemedToday}</Text>
          </View>
          <Pressable style={styles.filterButton}><Filter /></Pressable>
        </View>
        <View>
          <View style={styles.greyRow}>
            <View style={styles.filterRowBackground}>
              <GreyBackground />
            </View>
            <Text style={styles.filterRowText}>ALL TIME VISITS</Text>
            <Text style={styles.filterRowCount}>{statistics?.allTimeVisits}</Text>
          </View>
          <View style={styles.greyRow}>
            <View style={styles.filterRowBackground}>
              <GreyBackground />
            </View>
            <Text style={styles.filterRowText}>ALL TIME POINTS ISSUED</Text>
            <Text style={styles.filterRowCount}>{statistics?.allTimePointsIssued}</Text>
          </View>
          <View style={styles.greyRow}>
            <View style={styles.filterRowBackground}>
              <GreyBackground />
            </View>
            <Text style={styles.filterRowText}>ALL TIME POINTS REDEEMED</Text>
            <Text style={styles.filterRowCount}>{statistics?.allTimePointsRedeemed}</Text>
          </View>
        </View>


        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Recent Activity</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.restaurantIcon,
                  { backgroundColor: getRestaurantColor(transaction.restaurant) }
                ]}>
                  <Text style={styles.restaurantInitial}>{transaction.restaurant[0]}</Text>
                </View>
                <View style={[
                  styles.arrowContainer,
                  { backgroundColor: transaction.type === 'issued' ? '#E6FBEE' : '#FFEEF1' }
                ]}>
                  <Image
                    source={transaction.type === 'issued' ? icons.arrowDown : icons.arrowUp}
                    style={[
                      styles.transactionArrow,
                      { tintColor: transaction.type === 'issued' ? '#7FCE9D' : '#E76773' }
                    ]}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <View style={styles.transactionType}>
                    <Text style={styles.transactionTypeText}>
                      {transaction.type === 'issued' ? 'You issued' : 'Client redeemed'}
                    </Text>
                    <Text style={styles.transactionTypeText}>Points</Text>
                  </View>
                  <View style={styles.transactionDescription}>
                    <Text style={styles.transactionDescriptionText}>For</Text>
                    <Text style={styles.transactionDescriptionText}>{transaction.description}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={[
                  styles.transactionAmount,
                  transaction.type === 'issued' ? styles.amountReceived : styles.amountRedeemed
                ]}>
                  {transaction.type === 'issued' ? '+' : '-'} {transaction.amount}
                </Text>
                <Text style={styles.transactionBalance}>{transaction.points}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const getRestaurantColor = (restaurant: string): string => {
  const colors: Record<string, string> = {
    'MON LAPIN': '#5D47C1',
    'KFC': '#FC4C5D',
    'EDULIS': '#2FB763',
    'RPM': '#FFB800'
  };
  return colors[restaurant] || '#5D47C1';
};

interface Styles {
  container: ViewStyle;
  scrollView: ViewStyle;
  header: ViewStyle;
  userInfo: ViewStyle;
  avatar: ImageStyle;
  greeting: TextStyle;
  userName: TextStyle;
  notificationButton: ViewStyle;
  pointsCard: ViewStyle;
  pointsBackground: ViewStyle;
  pointsHeader: ViewStyle;
  pointsLabel: TextStyle;
  pointsValue: ViewStyle;
  pointsNumber: TextStyle;
  pointsUnit: TextStyle;
  pointsStats: ViewStyle;
  statItem: ViewStyle;
  statLabel: TextStyle;
  statValue: TextStyle;
  nextTitleInfo: ViewStyle;
  nextTitleInfoText: ViewStyle;
  nextTitleInfoTextText: TextStyle;
  nextTitleText: TextStyle;
  nextTitleTextNumber: TextStyle;
  statsContainer: ViewStyle;
  statCard: ViewStyle;
  statTitle: TextStyle;
  statContent: ViewStyle;
  statIconContainer: ViewStyle;
  statNumber: TextStyle;
  viewButton: ViewStyle;
  viewButtonText: TextStyle;
  transactionArrow: ImageStyle;
  arrowContainer: ViewStyle;
  activityContainer: ViewStyle;
  activityHeader: ViewStyle;
  activityTitle: TextStyle;
  seeAllButton: ViewStyle;
  seeAllText: TextStyle;
  transactionItem: ViewStyle;
  transactionLeft: ViewStyle;
  restaurantIcon: ViewStyle;
  transactionInfo: ViewStyle;
  transactionType: ViewStyle;
  transactionTypeText: TextStyle;
  transactionDescription: ViewStyle;
  transactionDescriptionText: TextStyle;
  transactionRight: ViewStyle;
  transactionAmount: TextStyle;
  amountReceived: TextStyle;
  amountRedeemed: TextStyle;
  transactionBalance: TextStyle;
  scanButton: ViewStyle;
  filterRowContainer: ViewStyle,
  filterRow: ViewStyle,
  filterRowBackground: ViewStyle,
  filterButton: ViewStyle,
  filterRowCount: TextStyle,
  qrIcon: ImageStyle;
  scanButtonText: TextStyle;
  restaurantInitial: TextStyle;
  filterRowText: TextStyle;
  greyRow: ViewStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  retryButton: ViewStyle;
  retryButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  filterRowBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterRowCount: {
    color: colors.text.black,
    fontWeight: '900',
    fontSize: 20,
  },
  filterRowText: {
    ...typography.body2,
    fontSize: 10,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  greyRow: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: colors.background.subtle,
    padding: 8,
    paddingHorizontal: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 20,
    marginHorizontal: 24,
    marginVertical: 5,
  },
  filterRow: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: colors.primary.light,
    padding: 8,
    paddingHorizontal: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: 20,

  },
  filterRowContainer: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginVertical: 16,
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: 20,
    padding: 8,
    backgroundColor: colors.primary.light,
  },
  pointsBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nextTitleInfoTextText: {
    ...typography.body2,
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.secondary,
  },

  nextTitleInfoText: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: colors.background.paper,
    padding: 8,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.background.paper,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  userName: {
    ...typography.subtitle1,
    color: colors.text.primary,
  },
  notificationButton: {
    backgroundColor: colors.background.default,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  notificationIcon: {
    width: 20,
    height: 20,
    tintColor: colors.text.primary,
  },
  pointsCard: {
    backgroundColor: colors.secondary.middle,
    borderRadius: 24,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    shadowRadius: 16,
  },
  pointsHeader: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 32,
  },
  pointsLabel: {
    ...typography.overline,
    color: colors.text.tertiary,
    marginBottom: 1,
  },
  pointsValue: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 0,
  },
  pointsNumber: {
    ...typography.h1,
    color: colors.text.primary,
    fontSize: 40,
    fontWeight: '900',
  },
  pointsUnit: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginLeft: 1,
    marginBottom: 10,
    fontWeight: '300',
  },
  pointsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.default,
    borderRadius: 24,
    padding: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border.secondary,

    shadowRadius: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    ...typography.overline,
    color: colors.text.tertiary,
    marginBottom: 1,
  },
  statValue: {
    ...typography.subtitle2,
    color: colors.text.secondary,
    fontWeight: '700',
  },
  nextTitleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 24,
  },
  warningIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
    tintColor: colors.text.white,
  },
  nextTitleText: {
    ...typography.body2,
    color: colors.text.white,
    flex: 1,
    fontSize: 12,
    marginHorizontal: 1,
  },
  nextTitleTextNumber: {
    ...typography.body2,
    color: colors.text.white,
    fontWeight: '700',
  },
  statsContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  statTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    margin: 4,
    marginHorizontal: 15,
    fontSize: 8,
    fontWeight: '500',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.subtle,
    borderRadius: 18,
    padding: 12,
    margin: 2,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  statIconContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  statIconText: {
    fontSize: 16,
  },
  statNumber: {
    ...typography.h4,
    color: colors.text.primary,
  },
  viewButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  viewButtonText: {
    ...typography.button,
    color: colors.text.white,
  },
  activityContainer: {
    backgroundColor: colors.background.paper,
    borderRadius: 24,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  activityTitle: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  seeAllButton: {
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  seeAllText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  restaurantIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionArrow: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  transactionInfo: {
    gap: 4,
  },
  transactionType: {
    flexDirection: 'row',
    gap: 4,
  },
  transactionTypeText: {
    ...typography.body2,
    color: colors.text.primary,
  },
  transactionDescription: {
    flexDirection: 'row',
    gap: 4,
  },
  transactionDescriptionText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  transactionAmount: {
    ...typography.subtitle2,
  },
  amountReceived: {
    color: colors.status.success,
  },
  amountRedeemed: {
    color: colors.status.error,
  },
  transactionBalance: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    alignSelf: 'center',
    marginVertical: 24,
    borderWidth: 1,
    borderColor: colors.border.default,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  qrIcon: {
    width: 20,
    height: 20,
    tintColor: colors.text.white,
  },
  scanButtonText: {
    ...typography.subtitle2,
    color: colors.text.white,
  },
  restaurantInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: '#EBEEFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    ...typography.body1,
    color: colors.text.secondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    ...typography.body1,
    color: colors.status.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.text.white,
  },
});

export default HomeScreen; 