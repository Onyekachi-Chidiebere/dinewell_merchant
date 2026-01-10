import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {
  CloseIcon,
  CalendarIcon,
  TimeIcon,
  DollarIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
} from '../assets/icons';
import colors from '../theme/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    type: 'received' | 'redeemed';
    amount: number;
    mealCost: number;
    restaurant: string;
    logo: any;
    date: string;
    time: string;
  };
};

const TransactionDetailsModal = ({ visible, onClose, transaction }: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.transactionId}>Transaction #{transaction.id}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <CloseIcon width={24} height={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* General Details Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>General Details</Text>
              </View>

              <View style={styles.detailsContainer}>
                {/* Type */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <View style={styles.detailContent}>
                    {transaction.type === 'received' ? (
                      <ArrowDownLeftIcon width={16} height={16} color="#D52B1E" />
                    ) : (
                      <ArrowUpRightIcon width={16} height={16} color="#D52B1E" />
                    )}
                    <View style={styles.separator} />
                    <Text style={styles.detailValue}>
                      Point {transaction.type === 'received' ? 'Deposit' : 'Redemption'}
                    </Text>
                  </View>
                </View>

                {/* Meal Cost */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Meal Cost</Text>
                  <View style={styles.detailContent}>
                    <DollarIcon width={16} height={16} color="#D52B1E" />
                    <View style={styles.separator} />
                    <Text style={styles.detailValue}>{transaction.mealCost}</Text>
                  </View>
                </View>

                {/* Points */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Points</Text>
                  <View style={[styles.detailContent, styles.pointsContent]}>
                    <Text style={styles.detailValue}>{transaction.amount}</Text>
                  </View>
                </View>

                {/* Restaurant */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Restaurant</Text>
                  <View style={styles.detailContent}>
                    <Image source={transaction.logo} style={styles.restaurantLogo} />
                    <View style={styles.separator} />
                    <Text style={styles.detailValue}>{transaction.restaurant}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Other Details Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>Other Details</Text>
              </View>

              <View style={styles.detailsContainer}>
                {/* Date */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <View style={styles.detailContent}>
                    <CalendarIcon width={16} height={16} color="#D52B1E" />
                    <View style={styles.separator} />
                    <Text style={styles.detailValue}>{transaction.date}</Text>
                  </View>
                </View>

                {/* Time */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Time</Text>
                  <View style={styles.detailContent}>
                    <TimeIcon width={16} height={16} color="#D52B1E" />
                    <View style={styles.separator} />
                    <Text style={styles.detailValue}>{transaction.time}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding:10,
  },
  container: {
    width: '100%',
    height: '42%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollView: {
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 4,
    paddingLeft: 12,
    backgroundColor: '#F3F4F7',
    borderRadius: 40,
  },
  transactionId: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 12,
    lineHeight: 14.4,
    color: '#828DA9',
  },
  closeButton: {
    padding: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E4EB',
  },
  section: {
    marginTop: 8,
    alignSelf: 'stretch',
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    paddingHorizontal: 8,
    backgroundColor: '#F6F8FA',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#EBEEFF',
    alignSelf: 'flex-start',
  },
  sectionTitleText: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 12,
    lineHeight: 14.4,
    color: '#828DA9',
  },
  detailsContainer: {
    marginTop: 4,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 8,
    padding: 4,
    paddingLeft: 12,
    backgroundColor: '#F6F8FA',
    borderRadius: 40,
  },
  detailLabel: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
    lineHeight: 14.4,
    color: '#49526A',
  },
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    paddingHorizontal: 12,
    paddingLeft: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#FEDDDB',
  },
  pointsContent: {
    padding: 4,
    paddingHorizontal: 8,
  },
  separator: {
    width: 0,
    height: 8,
    borderLeftWidth: 1,
    borderColor: '#FEDDDB',
  },
  detailValue: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
    lineHeight: 14.4,
    color: '#050505',
  },
  restaurantLogo: {
    width: 16,
    height: 16,
    borderRadius: 999,
  },
});

export default TransactionDetailsModal; 