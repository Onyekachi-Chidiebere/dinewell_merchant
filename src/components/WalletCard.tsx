import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../theme/colors';

const visaLogo = require('../assets/images/visa-logo.png');

const WalletCard = () => {
  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#F99F48', '#E45A16']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.2)']}
          style={styles.footerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.restaurantName}>Mon Lapin Restaurant</Text>
              <Text style={styles.cardType}>Dollar Debit Card</Text>
            </View>
            <Image source={visaLogo} style={styles.visaLogo} />
          </View>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
  card: {
    height: 210,
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBalanceTitle: {
    fontFamily: 'RedHatDisplay-Medium',
    fontSize: 12,
    color: colors.text.white,
    opacity: 0.9,
    letterSpacing: 1,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: -20,
  },
  currencySymbol: {
    fontFamily: 'ClashDisplay-Regular',
    fontSize: 24,
    color: colors.text.white,
    marginRight: 4,
    marginTop: 8,
  },
  cardBalance: {
    fontFamily: 'ClashDisplay-Bold',
    fontSize: 48,
    color: colors.text.white,
    lineHeight: 56,
  },
  footerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: '40%',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  restaurantName: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 18,
    color: colors.text.white,
  },
  cardType: {
    fontFamily: 'RedHatDisplay-Regular',
    fontSize: 12,
    color: colors.text.white,
    opacity: 0.8,
    marginTop: 4,
  },
  visaLogo: {
    width: 60,
    height: 20,
    resizeMode: 'contain',
  },
});

export default WalletCard;
