import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import colors from '../theme/colors';
import typography from '../theme/typography';
import { SearchIcon, CloseIcon, WarningIcon } from '../assets/icons';
import GradientCard from '../components/GradientCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ExploreStackParamList = {
  ExploreMain: undefined;
  RestaurantDiscovery: undefined;
};

type NavigationProp = NativeStackNavigationProp<ExploreStackParamList, 'RestaurantDiscovery'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RestaurantDiscoveryScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Image */}
      <Image
        source={require('../assets/images/map.png')}
        style={styles.mapImage}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchIcon width={20} height={20} color={colors.primary.main} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={handleClose}>
          <CloseIcon width={20} height={20} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* New Restaurants Alert */}
      <View style={styles.alertSection}>
        <View
          style={styles.alertCard}
        >
          <View style={styles.alertContent}>
            <WarningIcon width={16} height={16} color={colors.text.white} />
            <Text style={styles.alertText}>3 New Restaurants in this area</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewText}>View</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>12</Text>
        </View>
      </View>

      {/* Location Markers */}
      <View style={styles.markersContainer}>
        {/* Current Location Marker */}
        <View style={styles.currentLocationMarker}>
          <View style={styles.pulseCircle} />
          <View style={styles.innerCircle} />
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  mapImage: {
    position: 'absolute',
    marginTop:  SCREEN_HEIGHT*.15,
    width: '100%',
    height: SCREEN_HEIGHT*.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 8,
    backgroundColor: colors.background.paper,
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
  iconButton: {
    backgroundColor: colors.background.default,
    padding: 8,
    borderRadius: 24,
  },
  alertSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.background.paper,
    paddingBottom:10
  },
  alertCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    padding:5,
    backgroundColor: colors.primary.main
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  warningIcon: {
    width: 16,
    height: 16,
    tintColor: colors.text.white,
  },
  alertText: {
    ...typography.caption,
    color: colors.text.white,
  },
  viewText: {
    ...typography.caption,
    color: colors.text.white,
    fontWeight: '600',
    marginHorizontal:10  },
  countBadge: {
    backgroundColor: '#EFE2F4',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 0.6,
    borderColor: colors.border.subtle,
  },
  countText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  markersContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  currentLocationMarker: {
    position: 'absolute',
    top: '30%',
    left: '40%',
    width: 62,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary.main,
    opacity: 0.4,
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary.main,
  },
  locationMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF7013',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  locationIcon: {
    width: 14,
    height: 14,
    tintColor: '#2B0B4F',
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5.5,
    borderRightWidth: 5.5,
    borderBottomWidth: 0,
    borderTopWidth: 11,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#EF7013',
    transform: [{ rotate: '180deg' }],
  },
});

export default RestaurantDiscoveryScreen; 