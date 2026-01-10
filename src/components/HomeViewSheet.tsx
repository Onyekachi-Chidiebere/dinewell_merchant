import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';
import Scroll from '../assets/icons/scroll.svg';
import GradientCard from './GradientCard';

interface HomeViewSheetProps {
  pointsData: {
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
  };
}

const WEEKDAYS = [
  { day: 'MO', active: true },
  { day: 'TU', active: true },
  { day: 'WE', active: true },
  { day: 'TH', active: true },
  { day: 'FR', active: true },
  { day: 'SA', active: false },
  { day: 'SU', active: false },
];

const HomeViewSheet: React.FC<HomeViewSheetProps> = ({
  pointsData,
}) => {
  const [isWeek, setIsWeek] = React.useState(true);

  return (
    <>
        <View style={styles.header}>
          <GradientCard
            start={{ x: 0.25, y: 0.25 }}
            end={{ x: 0.5, y: 2 }}
            locations={[0, 0.95]}
            colors={[colors.background.default, colors.border.subtle]}
            style={styles.pointsCircleInner}>
            <pointsData.icon width={65} height={65} />
          </GradientCard>
          <View style={styles.headerText}>
            <Text style={styles.pointsNumber}>{isWeek ? pointsData.thisWeek : pointsData.totalPoints}</Text>
            <Text style={styles.title}>{pointsData.title}</Text>
            <Text style={styles.subtitle}>{isWeek ? 'This Week' : 'All Time'}</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => setIsWeek(true)}>
            <GradientCard
              start={{ x: 0.5, y: 0.05 }}
              end={{ x: 0.5, y: 1 }}
              locations={[0, 0.95]}
              colors={[isWeek ? colors.background.default : colors.background.paper, isWeek ? colors.primary.secondary : colors.background.paper]}
              style={isWeek ? styles.filterButtonActive : styles.filterButton}>
              <Text style={isWeek ? styles.filterButtonTextActive : styles.filterButtonText}>This Week</Text>
            </GradientCard>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsWeek(false)}>
            <GradientCard
              start={{ x: 0.5, y: 0.05 }}
              end={{ x: 0.5, y: 1 }}
              locations={[0, 0.95]}
              colors={[!isWeek ? colors.background.default : colors.background.paper, !isWeek ? colors.primary.secondary : colors.background.paper]}
              style={!isWeek ? styles.filterButtonActive : styles.filterButton}>
              <Text style={!isWeek ? styles.filterButtonTextActive : styles.filterButtonText}>All Time</Text>
            </GradientCard>
          </TouchableOpacity>
        </View>

      <GradientCard style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>This Week</Text>
            <View style={styles.dateSelector}>
              <View style={styles.monthContainer}>
                <Text style={styles.monthText}>May 2025</Text>
              </View>
              <Text style={styles.dateRange}>08 - 14</Text>
              <Scroll width={16} height={16} />
            </View>
          </View>

          <View style={styles.daysContainer}>
          {WEEKDAYS.map((item) => (
              <View
                key={item.day}
                style={[
                  styles.dayCircle,
                  !item.active && styles.dayCircleInactive
                ]}
              >
                <Text style={[
                  styles.dayText,
                  !item.active && styles.dayTextInactive
                ]}>{item.day}</Text>
              </View>
            ))}
          </View>
        </GradientCard>

        <ScrollView style={styles.content}>
          {pointsData.weekData.map((day) => (
            <View key={day.date} style={styles.daySection}>
              <View style={styles.dateHeader}>
                <Text style={styles.dayName}>{day.dayName}</Text>
                <Text style={styles.date}>{day.date}</Text>
              </View>

              <View style={styles.transactionsContainer}>
                {day.transactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transaction}>
                    <View style={styles.transactionLeft}>
                      <View style={styles.orderNumber}>
                        <Text style={styles.orderNumberText}>{transaction.order}</Text>
                      </View>
                        <View
                          style={styles.pointsTag}>
                          <Text style={styles.pointsTagText}>{transaction.points} pts</Text>
                        </View>

                      <View style={styles.restaurantContainer}>
                        <Text style={styles.restaurantName}>{transaction.restaurant}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  pointsCircleInner: {
    width: 100,
    height: 100,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 80,
  },
  pointsNumber: {
    ...typography.h1,
    color: colors.primary.main,
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 60.8,
  },
  headerText: {
    alignItems: 'center',
    position: 'absolute',
    top: 75
  },
  title: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 0,
    marginBottom: 0,
    marginTop: -10,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  filterButton: {
    borderRadius: 100,
    backgroundColor: colors.background.paper,
    borderWidth: .5,
    borderColor: colors.border.subtle,
  },
  filterButtonActive: {
    borderRadius: 100,
    backgroundColor: colors.background.subtle,
    borderWidth: .5,
    borderColor: colors.border.subtle,
  },
  filterButtonText: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontWeight: '500',
    marginHorizontal: 7,
    margin: 5,
  },
  filterButtonTextActive: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '500',
    marginHorizontal: 7,
    margin: 5,
  },
  content: {
    flex: 1,
  },
  daySection: {
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background.default,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 40,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  dayName: {
    ...typography.subtitle2,
    color: colors.text.secondary,
  },
  date: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 10,
  },
  transactionsContainer: {
    backgroundColor: colors.background.default,
    borderRadius: 20,
    padding: 8,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  orderNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderNumberText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  pointsTag: {
    borderRadius: 100,
    backgroundColor: colors.background.subtle,
    borderWidth: .5,
    flex: .5,
    justifyContent: 'center',
    borderColor: colors.border.subtle,
  },
  pointsTagText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '500',
    marginHorizontal: 12,
    margin: 10,
  },
  restaurantContainer: {
    flex: 1,
    backgroundColor: colors.background.dark,
    borderRadius: 999,
    padding: 12,
  },
  restaurantName: {
    ...typography.caption,
    color: colors.text.primary,
  },
  calendarContainer: {
    backgroundColor: colors.background.subtle,
    marginHorizontal: 12,
    borderRadius: 20,
    paddingBottom: 2,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 4,
    margin: 8,
  },
  calendarTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 12.6,
    letterSpacing: -0.4,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.default,
    borderRadius: 999,
    padding: 4,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: 4,
  },
  monthContainer: {
    backgroundColor: colors.background.default,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  monthText: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 12,
    lineHeight: 12.6,
    letterSpacing: -0.4,
  },
  dateRange: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 12.6,
    letterSpacing: -0.4,
  },
  daysContainerGradient: {
    borderRadius: 20,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    gap: 8,
    margin: 1,
    padding: 12,
    backgroundColor: colors.background.default,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: 20,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  dayCircleInactive: {
    backgroundColor: colors.background.paper,
    borderColor: colors.border.default,
  },
  dayText: {
    fontFamily: 'DynaPuff',
    fontSize: 16,
    lineHeight: 12.8,
    letterSpacing: -1.28,
    color: colors.text.secondary,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  dayTextInactive: {
    color: colors.text.tertiary,
  },
});

export default HomeViewSheet; 