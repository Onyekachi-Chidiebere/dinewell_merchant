import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Pressable,
  Modal,
  TextInput
} from 'react-native';
import colors from '../theme/colors';
import { SearchIcon, NotificationIcon, StarIcon } from '../assets/icons/index';
import { useBottomSheet } from '../context/BottomSheetContext';
import typography from '../theme/typography';
import GreyBackground from '../assets/icons/grey-background.svg';
import AddIcon from '../assets/icons/add.svg';
import { useDishContext } from '../context/DishContext';


const DishesScreen = () => {
  const { openDishSheet } = useBottomSheet();

  const [dishDetails, setDishDetails] = useState(null);

  const { dishes, fetchDishes,activeDishes, searchQuery, setSearchQuery} = useDishContext();

  React.useEffect(() => {
    fetchDishes();
  }, [searchQuery]);

  const openCreateDish = () => openDishSheet({ });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.paper} />

      {/* Header */}
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
      <View style={styles.filterRowContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterRowBackground}>
            <GreyBackground />
          </View>
          <Text style={styles.filterRowText}>ACTIVE DISHES</Text>
          <Text style={styles.filterRowCount}>{activeDishes}</Text>
        </View>
        <Pressable onPress={openCreateDish} style={styles.filterButton}><AddIcon /></Pressable>
      </View>

      <ScrollView style={styles.content}>
        {dishes.map((dish: any) => (
          <TouchableOpacity
            key={dish.id}
          >
            <View style={styles.restaurantCard} >
              <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                  <View style={styles.logoContainer}>
                    <Image source={{ uri: dish.dish_image_url }} style={styles.logo} />
                    <View style={styles.nameContainer}>
                      <Text style={styles.restaurantName}>{dish.dish_name}</Text>
                    </View>
                  </View>
                  <View style={styles.dishPriceContainer}>
                    <Text style={styles.dishPrice}>${dish.price} <Text>per Dish</Text></Text>
                  </View>
                </View>
                <View style={styles.dishStatsContainer}>
                  <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                      <Text style={styles.distanceText}>{dish.points_per_dollar || 0}pts/$</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.stat}>
                      <Text style={styles.pointsText}>{dish.base_points_per_dish || 0}</Text>
                      <Text style={styles.statLabel}>Base Points</Text>
                    </View>

                  </View>
                  <Pressable onPress={() => setDishDetails(dish)} style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        visible={dishDetails !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDishDetails(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Pressable style={styles.closeButtonContainer} onPress={() => setDishDetails(null)}>
                <View style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </View>
              </Pressable>
            </View>
            <View style={styles.modalView}>
              <View style={styles.dishHeader}>
                <Image source={{ uri: dishDetails?.dish_image_url }} style={styles.dishLogo} />
                <Text style={styles.dishTitle}>{dishDetails?.dish_name}</Text>
              </View>

              <View style={styles.dishInfoSection}>
                <View style={styles.dishInfoItem}>
                  <Text style={styles.dishInfoLabel}>Price Per Dish</Text>
                  <Text style={styles.dishInfoValue}>${dishDetails?.price}</Text>
                </View>
              </View>
              <View style={styles.statusSection}>
                <Text style={styles.dishInfoLabel}>Status</Text>
                <Text style={styles.statusValue}>Active</Text>
              </View>

              <View style={styles.modalActions}>
                <Pressable style={styles.pauseButton}>
                  <Text style={styles.pauseButtonText}>Pause Dish</Text>
                </Pressable>
                <Pressable style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit Dish</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  modalView: {
    padding: 16,
  },
  dishHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  dishLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  dishTitle: {
    ...typography.h3,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  dishInfoSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  dishInfoItem: {
    marginBottom: 16,
  },
  dishInfoLabel: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  dishInfoValue: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  statsSection: {
    paddingVertical: 24,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.subtle,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  statBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statLabelModal: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: 'bold',
  },
  statValue: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statusSection: {
    paddingVertical: 16,
  },
  statusValue: {
    ...typography.body1,
    color: '#22C55E',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 24,
    gap: 16,
  },
  pauseButton: {
    flex: 1,
    padding: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
  },
  pauseButtonText: {
    ...typography.body1,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  editButton: {
    flex: 1,
    padding: 16,
    borderRadius: 30,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
  },
  editButtonText: {
    ...typography.body1,
    fontWeight: 'bold',
    color: colors.text.white,
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
  viewButtonText: {
    color: colors.text.white,
    fontWeight: '700',
    fontSize: 12,
  },
  viewButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dishStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dishPrice: {
    ...typography.body2,
    fontSize: 10,
  },
  dishPriceContainer: {
    backgroundColor: colors.background.default,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
    marginHorizontal: 16,
    marginVertical: 16,
  },
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
  historyRestaurantName: {
    ...typography.caption,
    color: colors.text.primary,
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
    color: colors.primary.middle,
    fontWeight: '500',
    marginHorizontal: 10,
    margin: 6,
  },
  restaurantContainer: {
    flex: 1,
    backgroundColor: colors.background.dark,
    borderRadius: 999,
    padding: 12,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  greeting: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
    color: colors.text.secondary,
  },
  userName: {
    fontFamily: 'MavenPro-Bold',
    fontSize: 14,
    color: colors.text.primary,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 8,
    backgroundColor: colors.background.subtle,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  notificationButton: {
    padding: 8,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  restaurantCard: {
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '98%',
    margin: 'auto',
    marginTop: 3,
    height: 120,
    borderRadius: 20,
    resizeMode: 'cover',
  },

  restaurantInfo: {
    padding: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  nameContainer: {
    gap: 6,
  },
  restaurantName: {
    fontFamily: 'RedHatDisplay-SemiBold',
    fontSize: 20,
    letterSpacing: -0.4,
    color: colors.text.primary,
  },

  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  stat: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  starIcon: {
    width: 16,
    height: 16,
    tintColor: '#EF7013',
  },
  rating: {
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 12,
    letterSpacing: -0.24,
    color: '#EF7013',
  },
  divider: {
    width: 1,
    height: 17,
    backgroundColor: colors.border.subtle,
  },
  pointsText: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 12,
    color: colors.text.secondary,
  },
  distanceText: {
    fontFamily: 'RedHatDisplay-Bold',
    fontSize: 12,
    color: colors.text.secondary,
  },
  statLabel: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
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
    backgroundColor: colors.primary.light,
    padding: 10,
    borderWidth: .5,
    borderColor: colors.border.secondary,
  },
  filterButtonActive: {
    borderRadius: 100,
    backgroundColor: colors.border.fade,
    borderWidth: .5,
    borderColor: colors.border.dark,
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

  daySection: {
    marginBottom: 10,
    paddingHorizontal: 12,
  },
});

export default DishesScreen; 