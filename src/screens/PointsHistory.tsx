import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Pressable,
  Modal,
  FlatList,
} from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { SearchIcon, NotificationIcon } from '../assets/icons';
import ArrowDownIcon from '../assets/icons/ArrowDownIcon.svg';
import ArrowUpIcon from '../assets/icons/ArrowUpIcon.svg';
import DollarIcon from '../assets/icons/DollarIcon.svg';
import ArrowSimpleDownIcon from '../assets/icons/ArrowSimpleDownIcon.svg';
import ArrowSimpleUpIcon from '../assets/icons/ArrowSimpleUpIcon.svg';
import CalendarIcon from '../assets/icons/CalendarIcon.svg';
import ClockIcon from '../assets/icons/ClockIcon.svg';
import CloseIcon from '../assets/icons/close.svg';
import CardIcon from '../assets/icons/CardIcon.svg';


const PointHistoryScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showBundle, setShowBundle] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [trasactionDetails, setTrasactionDetails] = useState(null);

  useEffect(() => {
    setTransactions(getTransactions());
  }, [searchQuery]);

  const getTransactions = ( searchQuery: string ) => {
    return [
      {
        date: '01/05/2025',
        transactions: [
          { id: 1, amount: 100, points: 1000, type: 'redeemed', date: '2021-01-01', customer: 'John Doe' },
          { id: 2,  amount: 200, points: 2000, type: 'issued', date: '2021-01-02', customer: 'Jane Doe' },
        ],
      },
      {
        date: '08/05/2025',
        transactions: [
          { id: 2, amount: 200, points: 2000, type: 'redeemed', date: '2021-01-02', customer: 'John Doe' },
          { id: 3, amount: 300, points: 3000, type: 'redeemed', date: '2021-01-03', customer: 'Jane Doe' },
        ],
      },
     
    ];
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchIcon width={20} height={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <NotificationIcon width={24} height={24} color={colors.primary.main} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <>
            <View style={styles.dateTag}>
              <Text style={styles.dateTagText}>{item.date}</Text>
            
            </View>
            {item.transactions.map((transaction) => (
                 <Pressable onPress={() => setShowActivity(true)} style={styles.activityItem}>
                 <View style={styles.activityInfo}>
                   <View style={styles.avatarContainer}>
                     <View style={styles.activityIcon}>
                       {transaction.type === 'redeemed' ? <ArrowDownIcon /> : <ArrowUpIcon />}
                     </View>
                   </View>
                   <View>
                     <Text style={styles.activityTitle}>Points {transaction.type === 'redeemed' ? 'Redeemed' : 'Issued'}</Text>
                     <Text style={styles.activitySubtitle}>{transaction.type === 'redeemed' ?  `By ${transaction.customer}` : `To ${transaction.customer}`}</Text>
                   </View>
                 </View>
                 <View style={styles.activityPoints}>
                   <Text style={transaction.type === 'redeemed' ? styles.pointsRedeemed : styles.pointsIssued}>N{transaction.amount}</Text>
                   <Text style={styles.pointsBalance}>{transaction.points}</Text>
                 </View>
               </Pressable>
               
              ))}
          </>
        )}
      />
    

      
      <Modal
        visible={showBundle}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBundle(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.transactionId}>Purchase ID #3443242</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowBundle(false)}>
                <CloseIcon width={24} height={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>General Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bundle Price</Text>
                <View style={styles.detailValueContainer}>
                  <DollarIcon />
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>100</Text>
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bundle Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Points Received</Text>
                <View style={styles.detailValueContainer}>
                  <ArrowSimpleDownIcon />
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>2200</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Points Issued</Text>
                <View style={styles.detailValueContainer}>
                  <ArrowSimpleUpIcon />
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>1100</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Points Left</Text>
                <View style={styles.detailValueContainer}>
                  <CalendarIcon />
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>1100</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Active Days Left</Text>
                <View style={styles.detailValueContainer}>
                  <ClockIcon />
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>32 Days</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Other Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Purchase mode</Text>
                <View style={styles.detailValueContainer}>
                  <CardIcon />
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>Card</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <View style={styles.detailValueContainer}>
                  <CalendarIcon />
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>7th, June 2024</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time</Text>
                <View style={styles.detailValueContainer}>
                  <ClockIcon />
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>6:42pm</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showActivity}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActivity(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.transactionId}>Transaction ID #3443242</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowActivity(false)}>
                <CloseIcon width={24} height={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>General Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type Price</Text>
                <View style={styles.detailValueContainer}>
                  <ArrowSimpleDownIcon />
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>Point Redeemed</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Points</Text>
                <View style={styles.detailValueContainer}>
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>50</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer</Text>
                <View style={styles.detailValueContainer}>
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>Chidi Samuel</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Other Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <View style={styles.detailValueContainer}>
                  <CalendarIcon />
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>7th, June 2024</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time</Text>
                <View style={styles.detailValueContainer}>
                  <ClockIcon />
                  <View style={styles.separator} />
                  <Text style={styles.detailValue}>6:42pm</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  transactionId: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 12,
    lineHeight: 14.4,
    color: '#828DA9',
  },
  section: {
    alignSelf: 'stretch',
    gap: 4
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    borderRadius: 40,
    padding: 6,
  },
  detailLabel: {
    ...typography.body2,
    color: colors.text.secondary,
    marginHorizontal: 8,
  },
  detailValueContainer: {
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
  separator: {
    width: 1,
    height: 12,
    backgroundColor: colors.border.subtle,
    marginHorizontal: 8,
  },
  detailValue: {
    ...typography.body2,
    color: colors.text.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.paper,
    width: '95%',
    borderRadius: 24,
    padding: 10,
    margin: 10,
    gap: 4
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#F6F8FA',
    borderRadius: 30,
    padding: 2,
    marginBottom: 24,
  },
  closeButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    padding: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  closeButton: {
    backgroundColor: '#FCEFE3',
    width: 28,
    height: 28,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text.white
  },
  activityContainer: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  activityList: {
    backgroundColor: colors.background.paper,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 40,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: 10,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  activityIcon: {
    margin:10
  },
  activityTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  activitySubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  activityPoints: {
    alignItems: 'flex-end',
  },
  pointsRedeemed: {
    ...typography.body1,
    color: '#10B981',
    fontWeight: 'bold',
  },
  pointsIssued: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  pointsBalance: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  historyContainer: {
    // marginHorizontal: 16,
    marginBottom: 16,
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
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.paper,
    borderRadius: 30,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  bundleName: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginHorizontal: 10
  },
  bundleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bundlePoints: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  bundlePointsUnit: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  bundlePriceContainer: {
    backgroundColor: '#FCEFE3',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  bundlePrice: {
    ...typography.body2,
    color: '#4B5563',
    fontWeight: '600',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  typeButtonTextActive: {
    color: colors.text.secondary,
    fontWeight: '600',
    fontSize: 12,
  },
  typeButtonTextInactive: {
    color: colors.text.tertiary,
    fontWeight: '600',
    fontSize: 12,
  },
  typeButtonActive: {
    backgroundColor: colors.primary.main,
    padding: 8,
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  typeButtonInactive: {
    padding: 8,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 0.6,
    borderColor: colors.border.default,
    backgroundColor: colors.background.dark,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
  },
  pointsBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pointsCard: {
    backgroundColor: colors.secondary.middle,
    borderRadius: 24,
    marginHorizontal: 16,
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
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.default,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    ...typography.caption,
    color: colors.text.tertiary,
    padding: 0,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    backgroundColor: colors.background.default,
    padding: 4,
    borderRadius: 24,
  },
  content: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  restaurantCard: {
    backgroundColor: colors.background.default,
    position: 'relative',
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    gap: 20,
    borderWidth: 1,
    borderColor: 'rgba(210, 211, 243, 0.5)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.paper,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  logoText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  restaurantInfo: {
    gap: 6,
  },
  restaurantName: {
    ...typography.subtitle1,
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.4,
  },
  location: {
    ...typography.caption,
    color: colors.text.tertiary,
    letterSpacing: -0.24,
    lineHeight: 16,
    marginTop: -7
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    ...typography.caption,
    color: '#EF7013',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 17,
    backgroundColor: colors.border.subtle,
  },
  pointsText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '700',
  },
});

export default PointHistoryScreen; 